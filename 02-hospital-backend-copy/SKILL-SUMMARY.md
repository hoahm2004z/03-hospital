# Tổng kết Hospital Backend (168 bài)

Ôn nhanh trước phỏng vấn. Gom concept trùng theo thứ tự học.

## Bảng 1 — Kiến thức đã học

| Skill | Tóm tắt dễ hiểu |
| --- | --- |
| Backend project | Phía máy chủ xử lý request và dữ liệu, không phải giao diện. |
| Cấu trúc thư mục src | Chia file theo vai trò để dễ đọc và mở rộng. |
| Node.js runtime | Môi trường chạy JavaScript phía server. |
| V8 | Động cơ bên trong Node dùng để chạy JavaScript. |
| npm | Công cụ cài và quản lý thư viện cho project Node. |
| package.json | Giấy khai sinh project: tên, script, danh sách dependency. |
| package-lock.json | Khóa phiên bản thư viện đã cài cho đồng nhất giữa máy. |
| dependency / devDependency | Thư viện chạy thật vs thư viện chỉ dùng lúc code/test. |
| npm install / npm scripts | Tải thư viện và chạy lệnh tắt khai báo trong package.json. |
| Environment variables | Cấu hình bí mật/cổng/DB nằm ngoài code, đọc qua process.env. |
| Client vs Server | Client gửi yêu cầu; Server nhận, xử lý, trả kết quả. |
| HTTP | Giao thức trao đổi Request/Response trên web. |
| URL / Method / Headers / Body | Địa chỉ, động từ HTTP, metadata, và dữ liệu gửi kèm. |
| Status code | Số cho biết kết quả: thành công, lỗi client, lỗi server… |
| Express | Framework giúp tạo HTTP server và route nhanh trên Node. |
| Middleware | Lớp trung gian xử lý Request trước (hoặc quanh) handler. |
| Router | Nhóm nhiều route liên quan vào một module. |
| Controller | Nhận req/res, gọi tầng dưới, trả JSON cho client. |
| Service | Chứa business logic (quy tắc nghiệp vụ) của hệ thống. |
| Repository | Chịu trách nhiệm thao tác dữ liệu / Database. |
| DTO | Object chuẩn hóa shape dữ liệu vào/ra API. |
| Config | Chỗ tập trung thiết lập app (port, tên service…). |
| CORS | Cho phép trình duyệt gọi API từ origin khác. |
| Logger middleware | Ghi lại method/URL/thời gian mỗi request. |
| Validation | Kiểm tra input có đủ và đúng hình trước khi xử lý. |
| Auth middleware (cơ bản) | Chặn request chưa có bằng chứng đăng nhập. |
| Error handler | Một chỗ bắt lỗi và trả JSON lỗi thống nhất. |
| PostgreSQL | Database quan hệ lưu Patient, Doctor, Appointment, User. |
| ORM | Cầu nối object trong code với bảng Database. |
| Prisma | ORM dùng schema + client để CRUD PostgreSQL. |
| Prisma Migrate | Tạo/áp migration để DB khớp schema. |
| Prisma Studio | Giao diện xem/sửa dữ liệu DB khi học. |
| Model / Relation | Khai báo bảng và quan hệ 1-n giữa các model. |
| Unique constraint | DB không cho trùng tổ hợp giá trị (vd bác sĩ + giờ). |
| CRUD qua ORM | Create/Read/Update/Delete bằng API Prisma thay vì SQL tay. |
| include / relation query | Lấy kèm dữ liệu quan hệ (patient, doctor) trong một query. |
| where / filter | Lọc danh sách theo điều kiện (doctorId, status…). |
| findUnique / findMany | Lấy một bản ghi theo khóa hoặc lấy nhiều bản ghi. |
| Transaction | Gom nhiều thao tác DB: thành công hết hoặc hủy hết. |
| Raw SQL ($queryRaw) | Chạy SQL thật khi cần báo cáo/query đặc biệt. |
| TypeORM (concept) | ORM khác theo hướng entity/class; khóa này chỉ tiếp xúc tên. |
| Required & Type | Field bắt buộc và đúng kiểu dữ liệu. |
| Zod | Thư viện khai báo schema để validate (và coerce) input. |
| Format / Length / Range / Email | Luật hình dạng, độ dài, khoảng giá trị, email. |
| Enum & Date validation | Chỉ nhận giá trị trong tập cho sẵn; kiểm format ngày. |
| Nested & Array validation | Validate object lồng và mảng phần tử. |
| Sanitization | Làm sạch/chuẩn hóa chuỗi (trim, lowercase) trước khi dùng. |
| Joi / class-validator (concept) | Hai thư viện validate phổ biến khác; chỉ học nhận diện. |
| Validation middleware | Factory gắn schema Zod vào route trước controller. |
| Custom Error (AppError) | Error có statusCode + code + details để trả HTTP đúng. |
| Error response chuẩn | JSON lỗi thống nhất: message, code, errors (nếu có). |
| asyncHandler | Bọc async route để lỗi Promise chảy vào error middleware. |
| Centralized logging lỗi | Log lỗi một chỗ kèm method/path/code. |
| Validation vs Business error | 400 sai hình input khác 409/401 sai nghiệp vụ. |
| Authentication | Xác định “bạn là ai” (đăng nhập / token). |
| Register | Tạo tài khoản user mới. |
| Password hashing / salt / bcrypt | Không lưu mật khẩu thô; hash một chiều có salt. |
| Argon2 (concept) | Thuật toán hash password hiện đại; khóa này chỉ tiếp xúc. |
| Login / verify password | So mật khẩu nhập với hash đã lưu. |
| Session vs Token (concept) | Hai cách giữ trạng thái đăng nhập; khóa đi hướng token. |
| JWT cấu trúc | Token 3 phần: Header, Payload, Signature. |
| Sign / Verify / Expiration | Ký JWT, kiểm chữ ký, và hết hạn theo exp. |
| Bearer Access Token | Gửi access token trong header Authorization: Bearer. |
| Refresh Token | Token dài hơn để cấp lại access khi access hết hạn. |
| Auth middleware JWT | Verify access token thật và gắn req.user. |
| Authorization | Sau khi biết bạn là ai, quyết định bạn được làm gì. |
| Role & Permission | Role mang tập quyền; route check permission. |
| RBAC Hospital | Phân quyền admin / doctor / patient cho API bệnh viện. |
| 401 vs 403 | 401 chưa xác thực/token fail; 403 đã login nhưng thiếu quyền. |
| Patient CRUD | API tạo/đọc/sửa/xóa bệnh nhân. |
| Doctor CRUD & Schedule | API bác sĩ và xem lịch theo appointments của bác sĩ. |
| Booking flow | Luồng đặt lịch: validate → check tồn tại → tạo appointment. |
| Double booking | Chống trùng giờ bác sĩ bằng check + unique + bắt P2002. |
| Pagination | Chia list theo page/limit, trả meta tổng trang. |
| Filtering & Sorting | Lọc và sắp xếp list qua query. |
| Search | Tìm gần đúng theo tên/email/time… |
| Cache (intro) | Nhớ tạm kết quả query để đỡ hỏi DB (TTL). |
| Rate limiting | Giới hạn số request trong một cửa sổ thời gian. |
| Queue / Background job (intro) | Việc nền chạy sau, không chặn HTTP response. |
| Notification simulation | Giả lập thông báo sau đặt lịch (log job). |
| Postman testing | Gọi và kiểm API bằng client HTTP. |
| Swagger / OpenAPI | Tài liệu mô tả API, xem được tại /docs. |
| Integration E2E (concept) | Chạy xuyên suốt register → login → book → list. |
| Hospital Backend hoàn chỉnh | Ghép đủ auth, RBAC, CRUD, booking, query, docs thành một API. |


## Bảng 2 — Tôi đã trải nghiệm gì trong project

| Skill | Tôi đã làm gì trong project |
| --- | --- |
| Backend project | Tạo và chạy Hospital Backend trong thư mục 02-hospital-backend. |
| Cấu trúc thư mục src | Chia controllers, services, repositories, middlewares, routes, dto, validators. |
| Node.js runtime | Chạy server bằng node src/index.js / npm start. |
| V8 | Đã học concept, chưa cấu hình/deep dive V8 trong project. |
| npm | Cài express, prisma, zod, bcrypt, jsonwebtoken, swagger-ui-express… |
| package.json | Khai báo name, scripts start/dev, dependencies của hospital-backend. |
| package-lock.json | Xuất hiện/ cập nhật sau npm install trong project. |
| dependency / devDependency | Tách prisma CLI (dev) và @prisma/client, express (dependencies). |
| npm install / npm scripts | Cài thư viện và thêm script start chạy src/index.js. |
| Environment variables | Đặt DATABASE_URL và JWT_* trong .env; đọc ở Prisma/jwt. |
| Client vs Server | Dùng Postman/Swagger làm client gọi server localhost:3000. |
| HTTP | Gửi GET/POST/PATCH/DELETE và đọc JSON + status. |
| URL / Method / Headers / Body | Gọi /auth, /patients, /doctors, /appointments kèm Bearer và JSON body. |
| Status code | Trả 201 tạo lịch, 400 validate, 401/403 authz, 404, 409 trùng giờ, 429 rate limit. |
| Express | Dựng app Express trong src/index.js, listen port 3000. |
| Middleware | Gắn json, cors, logger, rateLimit, requireAuth, requirePermission, validateBody, errorHandler. |
| Router | Tách auth.routes, patient.routes, doctor.routes rồi app.use. |
| Controller | Viết auth/patient/doctor/appointment.controller nhận req và trả res. |
| Service | Đặt logic register/login, booking, CRUD patient/doctor trong services. |
| Repository | Tách Prisma create/find/update/delete appointment/patient/doctor/user. |
| DTO | toAppointmentResponseDto, toUserResponseDto, toPatient/DoctorResponseDto. |
| Config | src/config lưu port và serviceName. |
| CORS | app.use(cors()) để client khác origin gọi được API. |
| Logger middleware | middlewares/logger in method + url + thời gian mỗi request. |
| Validation | Zod schema cho appointment, auth, patient, doctor trước khi vào service. |
| Auth middleware (cơ bản) | Ban đầu requireAuth chỉ kiểm có Authorization; sau nâng lên JWT. |
| Error handler | errorHandler trả { message, code, errors? } và log JSON. |
| PostgreSQL | Kết nối hospital_db qua DATABASE_URL, lưu Patient/Doctor/Appointment/User. |
| ORM | Dùng Prisma thay vì viết SQL tay cho CRUD thường. |
| Prisma | schema.prisma + PrismaClient trong src/lib/prisma.js. |
| Prisma Migrate | Chạy migrate init và migrate thêm User. |
| Prisma Studio | Mở Studio để seed/sửa Patient, Doctor, đổi User.role = admin. |
| Model / Relation | Khai báo Appointment liên kết Patient và Doctor. |
| Unique constraint | @@unique([doctorId, time]) chống trùng lịch bác sĩ. |
| CRUD qua ORM | CRUD Patient/Doctor/User/Appointment bằng prisma.*.create/find/update/delete. |
| include / relation query | findMany appointment include patient + doctor để trả tên. |
| where / filter | Lọc appointments theo doctorId/status; doctors theo specialty. |
| findUnique / findMany | GET /appointments/:id bằng findUnique; list bằng findMany. |
| Transaction | createAppointmentRepo dùng $transaction check trùng rồi create. |
| Raw SQL ($queryRaw) | GET /appointments/stats GROUP BY status bằng $queryRaw. |
| TypeORM (concept) | Đã học concept, chưa thực hành trong project. |
| Required & Type | Zod coerce.number/int/positive cho patientId, doctorId. |
| Zod | validators/*.schema.js + validateBody(schema) trên route. |
| Format / Length / Range / Email | Regex HH:MM, min/max note, email trong contact/auth/patient/doctor. |
| Enum & Date validation | status enum booked/cancelled/completed; appointmentDate YYYY-MM-DD. |
| Nested & Array validation | contact object + symptoms[] trong createAppointmentSchema. |
| Sanitization | trim/toLowerCase trên time, email, note, symptoms trong Zod. |
| Joi / class-validator (concept) | Đã học concept, chưa thực hành trong project. |
| Validation middleware | middlewares/validateBody.js: safeParse → AppError VALIDATION_ERROR. |
| Custom Error (AppError) | errors/AppError.js dùng xuyên auth, booking, CRUD, permission. |
| Error response chuẩn | Trả code như DOUBLE_BOOKING, FORBIDDEN, TOKEN_EXPIRED… |
| asyncHandler | Bọc controller async để next(err) vào errorHandler. |
| Centralized logging lỗi | errorHandler log method/path/statusCode/code. |
| Validation vs Business error | Zod 400 khác EMAIL_EXISTS/DOUBLE_BOOKING/INVALID_CREDENTIALS. |
| Authentication | Luồng /auth/register và /auth/login + JWT bảo vệ API. |
| Register | POST /auth/register tạo User (hash password, role mặc định patient). |
| Password hashing / salt / bcrypt | lib/password.js hash/compare; lưu passwordHash. |
| Argon2 (concept) | Đã học concept, chưa thực hành trong project. |
| Login / verify password | loginService compare password rồi cấp token pair. |
| Session vs Token (concept) | Đã học concept; project dùng JWT, không làm session store. |
| JWT cấu trúc | Dùng jsonwebtoken; payload có sub, email, role. |
| Sign / Verify / Expiration | lib/jwt.js sign/verify access & refresh với expiresIn từ .env. |
| Bearer Access Token | requireAuth tách Bearer và verify access token. |
| Refresh Token | POST /auth/refresh nhận refreshToken, trả cặp token mới. |
| Auth middleware JWT | requireAuth gắn req.user = { id, email, role }. |
| Authorization | Sau auth, chặn theo quyền trước khi vào controller. |
| Role & Permission | auth/permissions.js + requirePermission('…'). |
| RBAC Hospital | admin đủ quyền; patient không patient:write/stats:read; doctor đọc patient. |
| 401 vs 403 | Thiếu/sai token → 401; patient gọi /patients hoặc /stats → 403. |
| Patient CRUD | routes /patients GET/POST/PATCH/DELETE qua Prisma. |
| Doctor CRUD & Schedule | Thay mock doctors bằng Prisma; GET /doctors/:id/schedule. |
| Booking flow | POST /appointments: permission → Zod → check patient/doctor → create. |
| Double booking | findFirst trong transaction + unique + bắt P2002 → 409 DOUBLE_BOOKING. |
| Pagination | listQuery page/limit; response có meta total/totalPages. |
| Filtering & Sorting | Query doctorId/status/specialty + sortBy/sortOrder trên list API. |
| Search | search trên name/email/time (appointments/patients/doctors). |
| Cache (intro) | cache.js Map + TTL; cache list/stats appointment (in-memory, chưa Redis). |
| Rate limiting | rateLimit global 120 req/phút/ip+path → 429 RATE_LIMITED (in-memory). |
| Queue / Background job (intro) | jobQueue.js mảng giả lập; chưa cài BullMQ/Redis thật. |
| Notification simulation | Sau create appointment enqueue notify-appointment (log console). |
| Postman testing | Test register/login/CRUD/booking/403/409 bằng Postman. |
| Swagger / OpenAPI | src/docs/swagger.js phục vụ UI tại /docs. |
| Integration E2E (concept) | Đã chạy xuyên register→login→book→list khi test; chưa viết bộ test tự động. |
| Hospital Backend hoàn chỉnh | Một API đủ auth JWT, RBAC, CRUD, booking, query, docs chạy được. |

