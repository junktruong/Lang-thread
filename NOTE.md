Note về những điều cần lưu ý trong dự án này 

dự án này được thiết kế phần đăng nhập theo provider bên thứ 3 cho tiện nên trong db sẽ có 2 bảng là account và user 
account sẽ lưu thông tin đăng nhập của người dùng với bên thứ 3 đấy ví dụ google, github 
còn user sẽ lưu thông tin người dùng gốc , do vậy một người dùng có thể có nhiều account do được đăng nhập bởi nhiều bên thứ 3 nhưng khi đăng nhập xong thì vẫn vào chung một tài khoản 
và để đảm bảo tính antomic thì cần sử dụng transaction trong mongodb để thực hiện tạo account và user cùng lúc 
nếu không sẽ dẫn đến hiện tượng riêng lẻ dữ liệu => có account nhưng không có user do lúc lạo user bị crash  hoặc có user nhưng không có account
=> để sử dụng transaction trong mongodb ta cần cài replSet cho mongo 
nó là gì nó là các node được mở ở các cổng cho phép mongo chạy song song các transaction 

các bước để mở node 


Bạn cần tạo folder mongodb-data để lưu lại dữ liệu replSet 

mkir ~/mongodb-data 

tiếp theo bạn cần tạo thêm các dir để lưu dữ liệu từng node ở đây tôi tạo 3 node 

cd ~/mongodb-data
mkdir rs1 rs2 rs3

hoặc 

mkdir -p ~/mongodb-data/rs1 ~/mongodb-data/rs2 ~/mongodb-data/rs3

tiếp theo mở 3 terminal để chạy 3 node 

mongod --port 27017 --dbpath ~/mongodb-data/rs1 --replSet rs0 --bind_ip localhost
mongod --port 27018 --dbpath ~/mongodb-data/rs2 --replSet rs0 --bind_ip localhost
mongod --port 27019 --dbpath ~/mongodb-data/rs3 --replSet rs0 --bind_ip localhost


mỗi node ta để vào một cổng node chính chúng ta sẽ để ở cổng chính mặc định của mongo 
lưu ý lúc này bạn phải tắt mongo đi vì mongo đang start sẽ chiếm cổng 27017 

sudo systemctl stop mongod

tiếp theo bạn mở một terminal nữa vào vào mongosh

mongosh --port 27017

sau đó khởi tạo  replSet :

config = {
  _id: "rs0",
  members: [
    { _id: 0, host: "localhost:27017" },
    { _id: 1, host: "localhost:27018" },
    { _id: 2, host: "localhost:27019" }
  ]
};
rs.initiate(config);

lưu ý kiểm tra sock xem có tồn tại không vì có thể do chúng ta tắt không đúng cách dẫn tới file sock vẫn còn chưa được xóa 

sudo rm /tmp/mongodb-27017.sock

==========================================================================================

đây là auth config của tôi :
export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(db) as any,
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            if (token.sub) session.user.id = token.sub
            return session
        },
    },
    pages: {
        signIn: "/auth/signin",
    },
}

như các bạn thấy thì ở phần session strategy tôi đang chọn là jwt 

nên ở phần call back tôi sẽ lấy vào session và token để trả về session


cách này khá hiệu quả vì nó sẽ lưu trong nextauth và không lưu ở db giúp cho việc lấy xác thực nhanh hơn 
nhược điểm là không thể quản lý các phiên đăng nhập rõ ràng, không để đăng nhập nhiều thiết bị vì chỉ có một jwt xác thực cho một người dùng 

Nếu muốn quản lý phiên rõ ràng thì bắt buộc tôi phải lưu session vào db nên tôi sẽ đổi jwt thành database 

do vậy nên tôi cũng phải sửa lại call back :

callbacks: {
  async session({ session, user }) {
    if (user) {
      session.user.id = user.id; // ✅ user lấy từ DB, có sẵn id
    }
    return session;
  },
}