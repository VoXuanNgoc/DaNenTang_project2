# BÁO CÁO BÀI TẬP LỚN (MINI-PROJECT 2)
# MÔN HỌC: LẬP TRÌNH ĐA NỀN TẢNG (MULTIPLATFORM DEVELOPMENT)

---

## THÔNG TIN CHUNG

- **Tên dự án**: Study Room Booking App (Ứng dụng Đặt phòng học và Phòng Lab trường Đại học)
- **Sinh viên thực hiện**: **Võ Xuân Ngọc**
- **Mã sinh viên (MSSV)**: **23IT180**
- **Email**: voxuanngoc@example.com
- **Vai trò**: Sinh viên phát triển ứng dụng (Senior React Native Developer & UI/UX Designer)
- **Kho lưu trữ GitHub**: [https://github.com/VoXuanNgoc/DaNenTang_project2](https://github.com/VoXuanNgoc/DaNenTang_project2)
- **Thư mục dự án**: `D:\BaiTap\Prooject2`

---

## 1. MỤC TIÊU DỰ ÁN

Dự án nhằm xây dựng một ứng dụng di động hoàn chỉnh, chuyên nghiệp chạy đa nền tảng (Android, iOS, Web) phục vụ việc tìm kiếm, tra cứu và đặt phòng học nhóm, phòng thực hành máy tính (Lab) và phòng tự học trong trường đại học.

### Các mục tiêu cốt lõi:
1. **Duyệt & Tìm kiếm**: Tra cứu nhanh danh sách phòng học theo tên, tòa nhà, loại phòng.
2. **Lọc đa tiêu chí**: Lọc kết hợp nhiều điều kiện (Phòng Lab, Phòng học, Tòa A3, Thư viện, Còn trống).
3. **Xem chi tiết & Tiện ích**: Thông tin sức chứa, trang thiết bị (Wi-Fi, Điều hòa, Máy chiếu, Bảng trắng...).
4. **Chọn ngày & Khung giờ**: Chọn 7 ngày tiếp theo (chặn ngày quá khứ), chọn 8 khung giờ chuẩn học kỳ.
5. **Bộ máy chống trùng lịch (Conflict Prevention Engine)**: Ngăn chặn tuyệt đối việc đặt trùng phòng/giờ bằng công thức toán học chính xác.
6. **Xác nhận đặt phòng**: Màn hình vé điện tử xác nhận đặt phòng thành công với mã booking.
7. **Quản lý & Hủy lịch**: Quản lý lịch đặt cá nhân, hủy lịch linh hoạt và tự động giải phóng khung giờ.
8. **Hồ sơ sinh viên**: Hiển thị thông tin sinh viên **Võ Xuân Ngọc (23IT180)** cùng bảng thống kê thời gian thực.

---

## 2. KIẾN TRÚC & CÔNG NGHỆ SỬ DỤNG (TECH STACK)

| Thành phần | Công nghệ / Thư viện | Phiên bản | Ghi chú |
| :--- | :--- | :--- | :--- |
| **Framework** | Expo Managed Workflow | SDK 57 (57.0.23) | Không dùng Native CLI phức tạp |
| **Ngôn ngữ** | TypeScript | 6.0.3 | Bật chế độ `strict: true` 100% |
| **Core UI** | React Native | 0.86.3 (React 19.2.3) | Hỗ trợ Android, iOS, Web |
| **Navigation** | React Navigation 7 | 7.x | Bottom Tabs + Native Stack |
| **Client State** | Zustand | 5.0.15 | Quản lý Bookings, Filters, Student Profile |
| **Server State** | TanStack Query | 5.103.1 | Caching, quản lý dữ liệu phòng học giả lập API |
| **List Rendering** | FlatList | Tối ưu 60fps | Memoized card, keyExtractor ổn định |
| **Icon Library** | @expo/vector-icons | Ionicons 15.0.2 | Hệ thống icon trường đại học đồng bộ |
| **Kiểm thử** | Jest + ts-jest | 30.5.1 | 20 bài kiểm thử đơn vị tự động |

---

## 3. THIẾT KẾ GIAO DIỆN (UI/UX DESIGN SYSTEM)

Giao diện được thiết kế theo phong cách **Modern University Study App**: Sạch sẽ, cao cấp, thân thiện với sinh viên và có độ nhận diện cao.

### Bảng màu chủ đạo:
- **Tím trường đại học (Primary Purple)**: `#6C4AB6` — Thể hiện sự tri thức, công nghệ và hiện đại.
- **Tím đậm (Dark Purple)**: `#49317D` — Dành cho nút nhấn sâu và đổ bóng.
- **Tím nhạt (Light Purple)**: `#F1ECFA` — Dành cho nền icon, chip trạng thái nhẹ.
- **Trắng tinh khiết (White)**: `#FFFFFF` — Nền thẻ card, modal và thanh điều hướng.
- **Vàng điểm nhấn (Accent Yellow)**: `#F6C945` — Điểm nhấn cho trạng thái đang chọn, avatar, icon sao lấp lánh.
- **Chữ đậm (Dark Text)**: `#25213A` — Đảm bảo độ tương phản cao (Accessibility WCAG).
- **Chữ phụ (Secondary Text)**: `#77728A` — Màu phụ đề và thông số kỹ thuật.
- **Còn trống (Available Green)**: `#27AE60` — Xanh lá tươi sáng thể hiện phòng sẵn sàng.
- **Đang bận / Hủy (Occupied Red)**: `#E65B5B` — Màu đỏ cam cảnh báo phòng đã kín hoặc lịch đã hủy.

---

## 4. CHI TIẾT CÁC MÀN HÌNH CHỨC NĂNG

### 4.1. Màn hình Phòng học (`BrowseRoomsScreen`)
- **Header cá nhân hóa**: Lời chào thân thiện: `"Xin chào, Võ Xuân Ngọc 👋"` cùng avatar tròn chữ **"N"** viền vàng.
- **Tìm kiếm thời gian thực**: Tìm kiếm theo tên phòng, tòa nhà, loại phòng với phản hồi tức thì và nút xóa text.
- **Hệ thống Filter Chip đa lựa chọn**:
  - `Tất cả`: Xóa các tiêu chí và hiển thị toàn bộ phòng.
  - `Phòng Lab`, `Phòng học`: Phân loại không gian.
  - `Tòa A3`, `Thư viện`: Phân loại khu vực giảng đường.
  - `Còn trống`: Chỉ hiển thị phòng đang trống.
- **Khu vực Phòng học nổi bật**: Cuộn ngang các phòng có sức chứa lớn và trang bị hiện đại.
- **Danh sách phòng học (FlatList)**: Card bo góc 16px, hiển thị ảnh phòng, tên, tòa nhà, số chỗ ngồi, nhãn loại phòng và trạng thái **"Còn trống"** / **"Đang được sử dụng"** rõ ràng bằng cả màu sắc và chữ viết.

### 4.2. Màn hình Chi tiết phòng (`RoomDetailScreen`)
- **Ảnh lớn & Thông số**: Hiển thị ảnh phòng chất lượng cao, vị trí tầng, sức chứa, mô tả không gian học thuật.
- **Danh sách tiện ích**: Hiển thị icon tích xanh cho các trang bị: Wi-Fi tốc độ cao, Điều hòa, Bảng trắng, Máy chiếu Full HD, Ổ cắm điện từng bàn.
- **Bộ chọn ngày học**:
  - Cho phép chọn 7 ngày tiếp theo kể từ ngày hiện tại.
  - Chặn hoàn toàn việc chọn các ngày trong quá khứ.
- **Bộ chọn khung giờ (Time Slots)**:
  - 8 ca học chuẩn: `08:00-09:00`, `09:00-10:00`, `10:00-11:00`, `11:00-12:00`, `13:00-14:00`, `14:00-15:00`, `15:00-16:00`, `16:00-17:00`.
  - Phân loại rõ ràng:
    - **Còn trống**: Khung giờ sẵn sàng, viền xám sáng.
    - **Đang chọn**: Nổi bật bằng nền tím và nhãn vàng.
    - **Đã đặt**: Nền xám mờ, gạch ngang chữ, bị vô hiệu hóa (disabled) không cho click.
- **Nút "Đặt phòng"**: Cố định phía dưới, kiểm tra tính hợp lệ trước khi đặt.

### 4.3. Màn hình Xác nhận đặt phòng (`BookingConfirmationScreen`)
- Màn hình chuyên dụng hiển thị ngay sau khi xác nhận đặt phòng thành công.
- Icon check thành công lớn viền vàng lấp lánh.
- Thẻ vé điện tử chứa:
  - Mã đặt phòng: Tự sinh dạng chuẩn `BK-2026-XXXX`.
  - Tên phòng & Tòa nhà.
  - Ngày đặt & Khung giờ.
  - Họ tên sinh viên: **Võ Xuân Ngọc**.
  - Mã sinh viên: **23IT180**.
- Hai nút điều hướng: **"Xem lịch đặt"** (chuyển sang tab Lịch đặt) và **"Quay lại danh sách phòng"**.

### 4.4. Màn hình Lịch đặt (`MyBookingsScreen`)
- Header tiếng Việt: `"Lịch đặt phòng của tôi"` hiển thị tổng số lượt đặt.
- Phân loại theo tab: **Tất cả**, **Sắp tới** (confirmed), **Đã hủy** (cancelled).
- Thẻ đặt phòng hiển thị mã vé, thời gian học, trạng thái.
- **Chức năng Hủy lịch đặt**:
  - Có hộp thoại cảnh báo xác nhận.
  - Khi xác nhận hủy: Cập nhật trạng thái thành `cancelled`, lập tức giải phóng khung giờ đó cho các sinh viên khác mà không làm mất lịch sử đã đặt.
- Giao diện trống (EmptyState) khi chưa có lịch đặt hướng dẫn sinh viên khám phá phòng học.

### 4.5. Màn hình Cá nhân (`ProfileScreen`)
- Thẻ sinh viên trực quan:
  - Họ tên: **Võ Xuân Ngọc**
  - MSSV: **23IT180**
  - Email: **voxuanngoc@example.com**
  - Vai trò: **Sinh viên**
  - Avatar chữ cái **"N"** viền vàng và tích xanh xác thực.
- Thống kê 3 chỉ số thời gian thực: **Tổng booking**, **Sắp tới**, **Đã hủy**.
- Menu tùy chọn:
  - Thông tin cá nhân (hiển thị popup chi tiết).
  - Lịch đặt phòng (chuyển nhanh sang tab Lịch đặt).
  - Trợ giúp & Hỗ trợ (Hotline quản lý giảng đường).
  - Cài đặt ứng dụng (Thông tin phiên bản v2.0.0).
- Bảng nội quy sử dụng phòng học của trường đại học.

---

## 5. THUẬT TOÁN CHỐNG TRÙNG LỊCH ĐẶT PHÒNG (CONFLICT ENGINE)

Được triển khai tập trung tại `src/utils/bookingUtils.ts`.

### 5.1. Chuyển đổi thời gian
Hàm `timeToMinutes("HH:mm")` chuyển đổi thời gian thành tổng số phút tính từ 00:00:
$$\text{Minutes} = \text{Hours} \times 60 + \text{Minutes}$$
*Ví dụ*: `10:30` $\rightarrow 10 \times 60 + 30 = 630$ phút.

### 5.2. Công thức kiểm tra giao thoa khoảng thời gian (Interval Overlap)
Hai khoảng thời gian $[s_1, e_1)$ và $[s_2, e_2)$ bị coi là trùng lịch khi và chỉ khi:
$$\max(s_1, s_2) < \min(e_1, e_2) \iff (s_1 < e_2) \land (s_2 < e_1)$$

- **Trường hợp bị từ chối (Conflict = true)**:
  - Lịch đã có: `10:00 - 11:00` ([600, 660])
  - Đặt `09:30 - 10:30` ([570, 630]) $\rightarrow \max(600, 570) = 600 < \min(660, 630) = 630$ (Đúng $\rightarrow$ **Từ chối**)
  - Đặt `10:00 - 11:00` ([600, 660]) $\rightarrow \max(600, 600) = 600 < \min(660, 660) = 660$ (Đúng $\rightarrow$ **Từ chối**)
  - Đặt `10:30 - 11:30` ([630, 690]) $\rightarrow \max(600, 630) = 630 < \min(660, 690) = 660$ (Đúng $\rightarrow$ **Từ chối**)
- **Trường hợp được chấp nhận (Conflict = false)**:
  - Tiếp giáp trước `09:00 - 10:00` ([540, 600]) $\rightarrow \max(600, 540) = 600 < \min(660, 600) = 600$ (Sai $\rightarrow$ **Hợp lệ**)
  - Tiếp giáp sau `11:00 - 12:00` ([660, 720]) $\rightarrow \max(600, 660) = 660 < \min(660, 720) = 660$ (Sai $\rightarrow$ **Hợp lệ**)

### 5.3. Xử lý trạng thái Hủy
- Khi sinh viên hủy phòng, thuộc tính `status` đổi thành `'cancelled'`.
- Thuật toán `checkBookingConflict` chỉ duyệt qua các booking có `status === 'confirmed'`.
- Do đó, slot vừa hủy sẽ được mở khóa ngay lập tức mà không cần xóa dữ liệu khỏi bộ nhớ.

---

## 6. KẾT QUẢ KIỂM THỬ (TESTING & VERIFICATION)

### 6.1. Kiểm thử TypeScript (Strict Mode)
Chạy lệnh:
```bash
npm run typecheck
```
**Kết quả**: `tsc --noEmit` hoàn thành với **0 lỗi**. Toàn bộ props, state, navigation params và kiểu dữ liệu đều được định nghĩa chặt chẽ.

### 6.2. Kiểm thử đơn vị Jest (Unit Tests)
Chạy lệnh:
```bash
npm test
```
**Kết quả**: **20/20 bài test PASS 100%**:
- Chuyển đổi giờ phút thành công và bắt lỗi định dạng sai.
- Kiểm tra chính xác các ca trùng bên trái, trùng bên phải, trùng hoàn toàn, bao trọn khung giờ.
- Kiểm tra chấp nhận các ca tiếp giáp sát giờ biên.
- Kiểm tra mở lại slot khi booking bị hủy.
- Kiểm tra phát hiện ngày trong quá khứ.

### 6.3. Kiểm thử đóng gói Metro Bundler
Kiểm tra đóng gói bundle bằng lệnh:
```bash
npx expo export -p android --no-minify
```
**Kết quả**: Đóng gói thành công `979` modules, không phát hiện lỗi trùng key (duplicate key warning) hay lỗi cú pháp runtime.

---

## 7. CẤU TRÚC THƯ MỤC DỰ ÁN

```text
D:\BaiTap\Prooject2\
├── App.tsx                          # Entry point chứa QueryClientProvider & SafeAreaProvider
├── package.json                     # Quản lý phiên bản dependencies và scripts
├── tsconfig.json                    # Cấu hình TypeScript Strict Mode
├── jest.config.js                   # Cấu hình kiểm thử Jest với ts-jest
├── README.md                        # Tài liệu giới thiệu kho mã nguồn GitHub
├── BAO_CAO_PROJECT2.md              # Báo cáo chi tiết bài tập lớn (File này)
└── src/
    ├── components/
    │   ├── BookingCard.tsx          # Thẻ vé lịch đặt phòng kèm nút hủy
    │   ├── EmptyState.tsx           # Trạng thái trống thân thiện
    │   ├── FilterChip.tsx           # Chip lọc màu tím hiện đại
    │   ├── RoomCard.tsx             # Thẻ phòng học tối ưu 60fps (thẻ dọc & thẻ ngang)
    │   └── TimeSlot.tsx             # Thẻ chọn khung giờ (Còn trống/Đang chọn/Đã đặt)
    ├── data/
    │   ├── mockBookings.ts          # Dữ liệu lịch đặt mẫu cho Võ Xuân Ngọc (23IT180)
    │   └── mockRooms.ts             # Dữ liệu 6 phòng học theo chuẩn đề bài
    ├── hooks/
    │   └── useRooms.ts              # Custom Hook TanStack Query quản lý cache phòng học
    ├── navigation/
    │   ├── AppNavigator.tsx         # NavigationContainer gốc
    │   ├── BrowseStackNavigator.tsx # Stack: Browse -> Detail -> Confirmation
    │   ├── MainTabNavigator.tsx     # 3 Bottom Tabs tiếng Việt (Phòng học, Lịch đặt, Cá nhân)
    │   └── types.ts                 # Định nghĩa TypeScript cho React Navigation 7
    ├── screens/
    │   ├── BookingConfirmationScreen.tsx # Màn hình xác nhận vé đặt phòng
    │   ├── BrowseRoomsScreen.tsx    # Màn hình duyệt phòng, tìm kiếm, phòng nổi bật
    │   ├── MyBookingsScreen.tsx     # Màn hình quản lý lịch đặt theo tab
    │   ├── ProfileScreen.tsx        # Màn hình hồ sơ cá nhân sinh viên Võ Xuân Ngọc
    │   └── RoomDetailScreen.tsx     # Màn hình chi tiết, chọn ngày và khung giờ
    ├── services/
    │   └── roomService.ts           # Dịch vụ giả lập REST API với độ trễ thực tế
    ├── store/
    │   └── bookingStore.ts          # Store Zustand quản lý trạng thái client & booking
    ├── theme/
    │   ├── colors.ts                # Bảng màu Tím - Trắng - Vàng chuẩn Modern University
    │   └── spacing.ts               # Tỷ lệ khoảng cách, bo góc và đổ bóng
    ├── types/
    │   ├── booking.ts               # Định nghĩa kiểu dữ liệu Booking và BookingInput
    │   └── room.ts                  # Định nghĩa kiểu dữ liệu Room, RoomType, RoomStatus
    └── utils/
        ├── bookingUtils.ts          # Bộ máy tính toán và chống trùng lịch đặt phòng
        └── __tests__/
            └── bookingUtils.test.ts # 20 unit tests kiểm thử logic xung đột
```

---

## 8. HƯỚNG DẪN CÀI ĐẶT VÀ KHỞI CHẠY

### 8.1. Cài đặt môi trường
Đảm bảo máy tính đã cài đặt Node.js (khuyến nghị v20 trở lên) và Git.

```bash
# Di chuyển vào thư mục dự án
cd D:\BaiTap\Prooject2

# Cài đặt các gói phụ thuộc (nếu tải mới từ GitHub)
npm install
```

### 8.2. Các lệnh khởi chạy

```bash
# 1. Chạy trên trình duyệt Web (Khuyến nghị để kiểm tra nhanh)
npm run web

# 2. Khởi động Expo Bundler (Dùng điện thoại quét mã QR qua app Expo Go)
npx expo start

# 3. Kiểm tra tính đúng đắn của kiểu dữ liệu TypeScript
npm run typecheck

# 4. Chạy toàn bộ bài kiểm thử đơn vị tự động
npm test
```

---

## 9. KẾT LUẬN & ĐÁNH GIÁ

Ứng dụng **Study Room Booking App** của sinh viên **Võ Xuân Ngọc (23IT180)** đã được hoàn thiện đạt chất lượng xuất sắc:
- Giao diện đạt chuẩn **Modern University Study App** với phong cách phối màu Tím - Trắng - Vàng cao cấp.
- Logic xử lý nghiệp vụ đặt phòng và thuật toán chống trùng lịch hoạt động thực tế, không có lỗi tiềm ẩn.
- Codebase cấu trúc sạch sẽ, phân tách rõ ràng các tầng Components, Screens, Navigation, Store, Services, Hooks và Utils.
- Đã được đẩy và lưu trữ an toàn tại kho GitHub: [https://github.com/VoXuanNgoc/DaNenTang_project2](https://github.com/VoXuanNgoc/DaNenTang_project2).
