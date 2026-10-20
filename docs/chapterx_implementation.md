# CHƯƠNG X. TRIỂN KHAI HIỆN THỰC WEBSITE HỖ TRỢ NGHIÊN CỨU VÀ TỔ CHỨC DẠY HỌC THEO MÔ HÌNH LỚP HỌC ĐẢO NGƯỢC

## X.1. Giới thiệu

Trong bối cảnh công nghệ thông tin ngày càng được ứng dụng rộng rãi trong giáo dục, việc xây dựng các nền tảng học tập trực tuyến không chỉ nhằm số hóa tài liệu giảng dạy mà còn tạo điều kiện để triển khai, quan sát và đánh giá các phương pháp dạy học mới. Đối với nghiên cứu khoa học giáo dục, một hệ thống học tập số có thể đóng vai trò là công cụ hỗ trợ tổ chức hoạt động dạy học, cung cấp học liệu cho người học và thu thập dữ liệu phục vụ quá trình nghiên cứu.

Xuất phát từ yêu cầu đó, đề tài tiến hành thiết kế và triển khai một website hỗ trợ tổ chức dạy học theo mô hình Lớp học đảo ngược (*Flipped Classroom*). Theo mô hình này, người học chủ động tiếp cận kiến thức nền tảng trước giờ học thông qua học liệu số; thời gian học tập trực tiếp được dành nhiều hơn cho các hoạt động trao đổi, thực hành, giải quyết vấn đề và vận dụng kiến thức. Giáo viên chuyển trọng tâm từ việc truyền đạt toàn bộ nội dung lý thuyết sang hướng dẫn, hỗ trợ và tổ chức hoạt động học tập.

Website được xây dựng nhằm tập trung hóa các thành phần phục vụ quá trình học tập, bao gồm video bài giảng, nội dung lý thuyết, tài liệu bổ trợ và không gian thảo luận. Bên cạnh đó, hệ thống cung cấp các chức năng quản lý học liệu và tài khoản người dùng, giúp giáo viên tổ chức nội dung trước giờ học và hỗ trợ người học trao đổi những vấn đề chưa hiểu.

Trong phạm vi nghiên cứu, website được xem là **một công cụ hỗ trợ triển khai phương pháp dạy học**, không phải bản thân phương pháp dạy học. Vì vậy, việc đánh giá hiệu quả sư phạm cần được thực hiện thông qua các tiêu chí phù hợp như kết quả học tập, mức độ chủ động của người học, chất lượng tương tác và phản hồi của người sử dụng, thay vì chỉ căn cứ vào việc hệ thống đã được xây dựng và vận hành.

## X.2. Mục tiêu và yêu cầu triển khai hệ thống

### X.2.1. Mục tiêu triển khai

Việc hiện thực hóa website hướng đến ba mục tiêu chính.

Thứ nhất, xây dựng môi trường học liệu số tập trung, cho phép giáo viên tổ chức nội dung bài học theo một cấu trúc thống nhất. Thay vì phân phối tài liệu qua nhiều kênh riêng biệt, giáo viên có thể tập hợp video, phần trình bày lý thuyết, phiếu học tập và tài liệu tham khảo tại một địa điểm truy cập chung.

Thứ hai, hỗ trợ tổ chức hoạt động tự học trước giờ lên lớp. Người học có thể chủ động tiếp cận tài liệu theo nhịp độ cá nhân, xem lại nội dung chưa hiểu và gửi câu hỏi liên quan trực tiếp đến bài học. Những câu hỏi này cung cấp thêm thông tin để giáo viên nhận diện các nội dung cần giải thích hoặc điều chỉnh hoạt động dạy học trên lớp.

Thứ ba, tạo điều kiện thu thập dữ liệu phục vụ nghiên cứu phương pháp giảng dạy. Thông qua các dữ liệu phù hợp như lượt truy cập học liệu, nội dung trao đổi và mức độ hoàn thành nhiệm vụ, nhà nghiên cứu có thể xem xét mối liên hệ giữa cách tổ chức học tập, mức độ tham gia của người học và kết quả học tập. Các dữ liệu này cần được kết hợp với bài kiểm tra, bảng hỏi hoặc phương pháp thu thập minh chứng khác để tránh kết luận hiệu quả sư phạm chỉ từ hoạt động truy cập website.

### X.2.2. Yêu cầu chức năng

Từ mục tiêu nghiên cứu, hệ thống được xác định cần đáp ứng các yêu cầu chức năng sau:

- **Quản lý học liệu:** Cho phép tạo lập, cập nhật, xuất bản và tổ chức các bài học theo cấu trúc thống nhất.
- **Trình bày nội dung đa phương tiện:** Hỗ trợ nhúng video từ YouTube, biên soạn nội dung lý thuyết có định dạng phong phú và cung cấp liên kết đến tài liệu bên ngoài như Google Drive.
- **Hỗ trợ thảo luận:** Cho phép người học đặt câu hỏi và phản hồi các nội dung trao đổi gắn với bài học.
- **Quản lý người dùng và phân quyền:** Phân biệt quyền hạn của quản trị viên, giáo viên và học sinh.
- **Kiểm duyệt nội dung:** Hỗ trợ giáo viên hoặc người có thẩm quyền quản lý các bình luận không phù hợp.
- **Hỗ trợ theo dõi hoạt động:** Tổ chức việc ghi nhận các thông tin hoạt động cần thiết cho quá trình quản lý lớp học và nghiên cứu.
- **Hỗ trợ nhiều loại thiết bị:** Bảo đảm giao diện có thể sử dụng trên máy tính, máy tính bảng và điện thoại thông minh.

### X.2.3. Yêu cầu sư phạm

Bên cạnh các yêu cầu kỹ thuật, hệ thống cần đáp ứng những nguyên tắc thiết kế gắn với mục tiêu dạy học.

Nội dung bài học phải được tổ chức theo trình tự rõ ràng, giúp người học nhận biết đâu là nội dung cần xem, kiến thức trọng tâm cần nắm vững, nhiệm vụ cần hoàn thành và vấn đề có thể trao đổi với giáo viên hoặc bạn học. Các thành phần của bài học cần hỗ trợ lẫn nhau thay vì tồn tại như những tài nguyên độc lập.

Đồng thời, website cần tạo điều kiện cho người học chủ động điều chỉnh thời gian và nhịp độ tiếp nhận kiến thức. Chức năng thảo luận cần gắn với nội dung học tập để những khó khăn của người học có thể được nhận diện và xử lý trong quá trình dạy học.

## X.3. Phân tích và thiết kế tổng thể hệ thống

### X.3.1. Các nhóm người dùng

Hệ thống được thiết kế với ba nhóm người dùng chính.

**Quản trị viên:** Chịu trách nhiệm quản lý tài khoản, kiểm soát quyền truy cập và hỗ trợ duy trì môi trường học tập theo chính sách của hệ thống.

**Giáo viên:** Chịu trách nhiệm biên soạn và quản lý học liệu, xuất bản bài học, tổ chức hoạt động tự học, phản hồi câu hỏi và kiểm duyệt các nội dung thảo luận khi cần thiết.

**Học sinh:** Sử dụng hệ thống để truy cập bài học, xem video, đọc tài liệu, thực hiện nhiệm vụ học tập và trao đổi các vấn đề chưa hiểu.

Việc phân chia vai trò nhằm bảo đảm mỗi nhóm người dùng thực hiện đúng nhiệm vụ của mình. Trong môi trường nghiên cứu sư phạm, phân quyền còn giúp hạn chế việc thay đổi học liệu hoặc dữ liệu ngoài phạm vi được cho phép, từ đó duy trì tính nhất quán khi tổ chức các hoạt động học tập.

### X.3.2. Kiến trúc logic

Về mặt chức năng, hệ thống có thể được mô tả thông qua ba lớp logic:

**Lớp giao diện người dùng:** Cung cấp các trang hiển thị bài học, trình bày học liệu, biểu mẫu quản lý nội dung và khu vực trao đổi. Giao diện được tổ chức theo hướng trực quan, hạn chế các thành phần không cần thiết làm phân tán sự chú ý khỏi nội dung học tập.

**Lớp xử lý nghiệp vụ:** Tiếp nhận các thao tác của người dùng và thực hiện các quy tắc của hệ thống, chẳng hạn như kiểm tra quyền truy cập, quản lý trạng thái xuất bản của bài học, xử lý hoạt động thảo luận và kiểm soát các thao tác quản trị.

**Lớp dữ liệu và tài nguyên:** Quản lý thông tin người dùng, bài học, nội dung thảo luận và những dữ liệu phục vụ hoạt động hệ thống. Đối với video YouTube và tài liệu Google Drive, website sử dụng phương thức nhúng hoặc liên kết đến tài nguyên tương ứng thay vì mặc định lưu trữ toàn bộ dữ liệu đa phương tiện trên hệ thống.

Đây là mô hình phân chia theo trách nhiệm chức năng. Công nghệ cụ thể được sử dụng ở lớp xử lý và lớp dữ liệu cần được mô tả theo cấu hình thực tế của phiên bản triển khai, không suy diễn từ kiến trúc logic.

### X.3.3. Công nghệ và thành phần chính

Theo định hướng triển khai của hệ thống, Next.js được sử dụng để xây dựng ứng dụng web. Nội dung học liệu được trình bày thông qua các thành phần giao diện chuyên biệt nhằm bảo đảm tính nhất quán giữa các bài học.

Các thành phần quan trọng bao gồm:

- **Trình soạn thảo TipTap:** Hỗ trợ giáo viên biên soạn nội dung lý thuyết dưới dạng văn bản có định dạng, qua đó tổ chức kiến thức thành các phần, tiêu đề, danh sách và nội dung nhấn mạnh.
- **Video YouTube nhúng:** Cung cấp phương tiện trực quan phục vụ hoạt động tự học trước giờ lên lớp.
- **Liên kết tài liệu Google Drive:** Cho phép kết nối bài học với phiếu học tập, tài liệu bổ trợ hoặc bài tập được lưu trữ bên ngoài.
- **Khu vực thảo luận:** Hỗ trợ trao đổi nội dung học tập theo cấu trúc bình luận và phản hồi.
- **Cơ chế phân quyền người dùng:** Phân biệt chức năng dành cho quản trị viên, giáo viên và học sinh.

Việc lựa chọn các thành phần trên hướng đến khả năng kết hợp nhiều loại học liệu trong một môi trường thống nhất. Tuy nhiên, hiệu quả sư phạm không được quyết định đơn thuần bởi công nghệ mà phụ thuộc vào chất lượng nội dung, cách thiết kế nhiệm vụ và phương pháp tổ chức hoạt động học tập.

## X.4. Triển khai các chức năng chính

### X.4.1. Chức năng quản lý và trình bày bài học

Bài học là đơn vị nội dung trung tâm của hệ thống. Mỗi bài học cần có các thông tin cơ bản như tiêu đề, nội dung giới thiệu, tài nguyên học tập, trạng thái xuất bản và khu vực thảo luận.

Việc tổ chức bài học theo cấu trúc thống nhất giúp giáo viên dễ dàng xây dựng học liệu và giúp học sinh hình thành thói quen sử dụng hệ thống. Khi truy cập một bài học, người học có thể nhận biết trình tự tiếp cận nội dung và các nhiệm vụ cần thực hiện.

Đối với phía quản lý, quy trình biên soạn bài học được tổ chức theo các bước: xác định mục tiêu học tập, chuẩn bị tài nguyên, biên soạn nội dung, kiểm tra các liên kết và xuất bản bài học. Trạng thái xuất bản giúp phân biệt nội dung đang được chuẩn bị với nội dung đã sẵn sàng cung cấp cho người học.

Chức năng này phục vụ yêu cầu nghiên cứu bằng cách duy trì cấu trúc học liệu tương đối ổn định giữa các bài học. Khi triển khai thực nghiệm sư phạm, giáo viên cần bảo đảm người học trong cùng điều kiện nghiên cứu được tiếp cận những tài nguyên và hướng dẫn tương ứng với kế hoạch dạy học đã xác định.

### X.4.2. Chức năng trình bày video bài giảng

Video bài giảng là thành phần hỗ trợ trực quan hóa kiến thức và cung cấp nội dung để người học nghiên cứu trước giờ lên lớp. Website cho phép tích hợp video thông qua đường dẫn YouTube và hiển thị nội dung trong giao diện bài học.

Khi lựa chọn hoặc biên soạn video, giáo viên cần cân nhắc mục tiêu bài học, độ phức tạp của kiến thức và thời gian tập trung của người học. Đối với những nội dung dùng để chuẩn bị bài trước giờ học, video ngắn, tập trung vào một chủ đề cụ thể có thể thuận tiện hơn cho việc theo dõi và xem lại. Thời lượng phù hợp cần được xác định dựa trên đặc điểm nội dung chứ không nên áp dụng như một giới hạn tuyệt đối cho mọi bài học.

Việc nhúng video trực tiếp vào trang bài học góp phần giảm thao tác chuyển đổi giữa các nền tảng. Tuy nhiên, khả năng phát video vẫn phụ thuộc vào kết nối Internet, quyền truy cập và trạng thái của tài nguyên bên ngoài. Do đó, cần kiểm tra tính hợp lệ của đường dẫn và khả năng hiển thị trước khi xuất bản bài học.

Về phương diện sư phạm, video không nên chỉ đóng vai trò truyền đạt kiến thức một chiều. Giáo viên cần gắn video với câu hỏi định hướng, nội dung lý thuyết hoặc nhiệm vụ học tập để hỗ trợ người học xác định những thông tin quan trọng cần ghi nhớ và hiểu.

### X.4.3. Chức năng biên soạn nội dung lý thuyết

Hệ thống sử dụng trình soạn thảo TipTap để hỗ trợ giáo viên xây dựng nội dung lý thuyết trực tiếp trên nền tảng. Thay vì chỉ cung cấp một tệp văn bản tĩnh, trình soạn thảo cho phép tổ chức nội dung thành các phần có định dạng, giúp người đọc phân biệt khái niệm, ví dụ, kết luận và kiến thức trọng tâm.

Một nội dung lý thuyết được thiết kế phù hợp cần thể hiện rõ mục tiêu kiến thức, thuật ngữ quan trọng, lập luận hoặc quy trình cần ghi nhớ, cùng với ví dụ minh họa khi cần thiết. Đối với những môn học có công thức, biểu thức hoặc quy trình giải quyết vấn đề, giáo viên cần đặc biệt chú ý đến độ chính xác của nội dung khi biên soạn.

Từ góc độ nghiên cứu phương pháp dạy học, nội dung lý thuyết trên website cần hỗ trợ hoạt động tự học thay vì thay thế toàn bộ quá trình tổ chức dạy học. Phần nội dung này chủ yếu cung cấp cơ sở để người học tiếp cận kiến thức ban đầu; việc giải quyết vấn đề phức tạp, thảo luận và vận dụng kiến thức có thể được tổ chức trong hoạt động trực tiếp trên lớp.

### X.4.4. Chức năng liên kết tài liệu và nhiệm vụ học tập

Website hỗ trợ tích hợp liên kết Google Drive để giáo viên phân phối phiếu học tập, bài tập chuẩn bị bài và tài liệu mở rộng. Chức năng này cho phép tận dụng các dịch vụ lưu trữ tài liệu hiện có, đồng thời tập trung các đường dẫn cần thiết trong cùng một bài học.

Mỗi liên kết cần đi kèm với mô tả rõ ràng về mục đích sử dụng. Ví dụ, một tài liệu có thể được xác định là phiếu học tập bắt buộc, tài liệu tham khảo hoặc bài tập mở rộng dành cho người học muốn tìm hiểu sâu hơn.

Việc xác định nhiệm vụ cụ thể giúp người học hiểu cần làm gì sau khi xem video hoặc đọc lý thuyết. Giáo viên cũng cần kiểm tra quyền chia sẻ của tài liệu, bảo đảm người học thuộc nhóm được phép truy cập có thể mở tài nguyên mà không gặp trở ngại không cần thiết.

Trong triển khai thực nghiệm, nhiệm vụ học tập cần được xây dựng thống nhất với mục tiêu bài học và nội dung kiểm tra. Đây là cơ sở để đánh giá người học đã chuẩn bị kiến thức đến mức độ nào trước khi tham gia hoạt động trên lớp.

### X.4.5. Chức năng thảo luận và phản hồi

Khu vực thảo luận được xây dựng nhằm tạo không gian trao đổi giữa học sinh và giáo viên xung quanh nội dung bài học. Học sinh có thể nêu câu hỏi khi gặp khái niệm khó, trình bày cách hiểu của bản thân hoặc phản hồi vấn đề do bạn học đưa ra.

Cấu trúc thảo luận được định hướng theo hai cấp: bình luận gốc và phản hồi trực tiếp. Cách tổ chức này giúp duy trì mối liên hệ giữa câu hỏi ban đầu và các phản hồi liên quan, hạn chế tình trạng nội dung trao đổi bị phân tán trong những chuỗi bình luận quá sâu.

Đối với giáo viên, khu vực thảo luận còn là nguồn thông tin hỗ trợ chuẩn bị bài dạy. Việc xem xét các câu hỏi trước buổi học có thể giúp giáo viên nhận diện nội dung nhiều học sinh chưa hiểu, phân biệt các lỗi hiểu sai thường gặp và xây dựng những hoạt động phù hợp với nhu cầu của lớp.

Chức năng này có mối liên hệ với quan điểm kiến tạo xã hội trong giáo dục, theo đó tương tác và hỗ trợ giữa người học với giáo viên hoặc bạn học có thể góp phần vào quá trình kiến tạo tri thức. Tuy nhiên, sự hiện diện của diễn đàn không tự động bảo đảm tương tác có chất lượng. Giáo viên cần có kế hoạch phản hồi và hướng dẫn người học tham gia thảo luận theo mục tiêu cụ thể.

### X.4.6. Chức năng quản lý người dùng và phân quyền

Để tạo môi trường học tập có kiểm soát, hệ thống phân biệt ba vai trò: quản trị viên, giáo viên và học sinh. Mỗi vai trò được cấp các quyền phù hợp với nhiệm vụ thực tế.

Quản trị viên quản lý tài khoản và các thiết lập chung của hệ thống. Giáo viên quản lý học liệu, điều hành các hoạt động liên quan đến bài học và kiểm duyệt thảo luận theo quyền được cấp. Học sinh sử dụng các chức năng học tập và tương tác được cho phép.

Theo định hướng ban đầu, tài khoản người dùng được quản lý theo cơ chế phê duyệt thay vì cho phép mọi người tự do tham gia môi trường lớp học. Cách tổ chức này giúp giới hạn phạm vi tham gia và hỗ trợ quản lý cộng đồng học tập. Nếu sử dụng tài khoản Gmail hoặc dịch vụ xác thực bên ngoài, hệ thống cần tuân thủ các cơ chế xác thực và phân quyền tương ứng; việc chỉ giới hạn loại địa chỉ email không đủ để chứng minh toàn bộ hệ thống đã an toàn.

Ngoài ra, quyền kiểm duyệt bình luận cần được áp dụng minh bạch. Việc xử lý các nội dung không phù hợp phải hướng đến duy trì môi trường học tập tôn trọng, an toàn và có tính xây dựng, đồng thời tránh ngăn cản những ý kiến phản biện học thuật hợp lệ.

### X.4.7. Thiết kế giao diện và khả năng sử dụng

Giao diện website được định hướng theo phong cách trực quan, sử dụng hệ màu nhẹ và các khối nội dung phân tách rõ ràng. Bảng màu Rare Wind Gradient với dải màu từ `#a8edea` đến `#fed6e3` có thể được sử dụng làm thành phần nhận diện thị giác, kết hợp với nền sáng và đường viền nhẹ để phân biệt các vùng chức năng.

Tuy nhiên, màu sắc chỉ là một yếu tố trong thiết kế giao diện. Khả năng đọc nội dung còn phụ thuộc vào độ tương phản, kích thước chữ, khoảng cách dòng, chiều rộng vùng văn bản và điều kiện hiển thị của từng thiết bị. Vì vậy, giao diện cần được kiểm tra trên các kích thước màn hình khác nhau và bảo đảm người dùng có thể nhận biết trạng thái cũng như chức năng của từng thành phần.

Bên cạnh đó, việc sử dụng biểu tượng đại diện cho tài khoản có thể giúp cá nhân hóa trải nghiệm học tập mà không bắt buộc người học phải hiển thị ảnh thật. Nếu được triển khai, bộ sưu tập avatar cần đi kèm cơ chế lựa chọn và hiển thị nhất quán trong các khu vực như hồ sơ người dùng và diễn đàn.

Các quyết định giao diện trong đề tài chủ yếu nhằm hỗ trợ khả năng sử dụng và tổ chức nội dung. Nếu muốn khẳng định rằng một kiểu giao diện cụ thể làm giảm mỏi mắt, tăng động lực hoặc cải thiện kết quả học tập, cần có nghiên cứu đánh giá riêng thay vì suy luận chỉ từ đặc điểm thiết kế.

## X.5. Quy trình sử dụng website trong mô hình Lớp học đảo ngược

Website được tổ chức để hỗ trợ ba giai đoạn của quá trình dạy học: trước giờ lên lớp, trong giờ lên lớp và sau giờ học.

### X.5.1. Giai đoạn trước giờ lên lớp

Ở giai đoạn này, giáo viên chuẩn bị và xuất bản bài học trên hệ thống, bao gồm video, phần lý thuyết, phiếu học tập và các hướng dẫn cần thiết. Học sinh truy cập bài học để xem video, đọc nội dung, thực hiện nhiệm vụ chuẩn bị và đặt câu hỏi nếu gặp khó khăn.

Mục tiêu của giai đoạn này là giúp học sinh bước đầu tiếp cận kiến thức nền tảng và hình thành những câu hỏi cần được giải đáp. Người học được khuyến khích chủ động điều chỉnh tốc độ học tập, xem lại nội dung chưa hiểu và đối chiếu thông tin giữa các thành phần học liệu.

Trước buổi học trực tiếp, giáo viên xem xét các câu hỏi hoặc phản hồi được ghi nhận trên hệ thống. Những thông tin này được sử dụng như một nguồn tham khảo để điều chỉnh trọng tâm bài giảng, lựa chọn ví dụ và thiết kế hoạt động học tập trên lớp.

### X.5.2. Giai đoạn trong giờ lên lớp

Trong giờ học trực tiếp, giáo viên sử dụng thông tin thu được từ quá trình chuẩn bị bài để tổ chức hoạt động phù hợp. Thay vì lặp lại toàn bộ nội dung học sinh đã được yêu cầu tự học, giáo viên tập trung giải thích những điểm khó, kiểm tra mức độ hiểu và hướng dẫn học sinh vận dụng kiến thức.

Các hoạt động có thể bao gồm thảo luận câu hỏi, giải quyết bài tập theo nhóm, phân tích tình huống, trình bày lời giải và phản biện kết quả. Giáo viên đóng vai trò tổ chức và hỗ trợ, giúp học sinh phát triển khả năng lập luận và vận dụng kiến thức.

Website đóng vai trò cung cấp học liệu và làm cơ sở kết nối hoạt động tự học với hoạt động trên lớp. Những nhiệm vụ cụ thể trong giờ học cần được xác định theo đặc điểm của môn học, mục tiêu bài học và trình độ của người học.

### X.5.3. Giai đoạn sau giờ học

Sau giờ học, học sinh có thể truy cập lại học liệu để củng cố kiến thức, xem lại các nội dung còn khó hiểu và hoàn thành nhiệm vụ mở rộng. Giáo viên có thể cập nhật tài liệu bổ trợ hoặc tiếp tục giải đáp câu hỏi phát sinh.

Giai đoạn này giúp duy trì sự liên tục của quá trình học tập và tạo cơ hội để người học tự đánh giá mức độ hiểu bài. Nếu hệ thống được bổ sung hoặc đã có chức năng ghi nhận tiến độ, dữ liệu thu thập có thể hỗ trợ giáo viên theo dõi hoạt động học tập, với điều kiện các chỉ số được định nghĩa rõ ràng và diễn giải phù hợp.

Tổng thể, quy trình ba giai đoạn thể hiện vai trò của website như một thành phần trong môi trường tổ chức dạy học. Hiệu quả của quy trình phụ thuộc vào sự phối hợp giữa thiết kế học liệu, nhiệm vụ học tập, hoạt động hướng dẫn của giáo viên và mức độ tham gia của người học.

## X.6. Tổ chức dữ liệu phục vụ hoạt động hệ thống và nghiên cứu

Bên cạnh các chức năng hiển thị, website cần tổ chức dữ liệu một cách nhất quán để hỗ trợ quản lý nội dung và phục vụ các hoạt động nghiên cứu có liên quan.

Về mặt nghiệp vụ, có thể xác định các nhóm dữ liệu chính như sau:

| Nhóm dữ liệu | Nội dung quản lý | Mục đích sử dụng |
|---|---|---|
| Người dùng | Thông tin tài khoản, vai trò và trạng thái truy cập | Quản lý quyền sử dụng hệ thống |
| Bài học | Tiêu đề, nội dung, tài nguyên và trạng thái xuất bản | Tổ chức và quản lý học liệu |
| Tài nguyên học tập | Đường dẫn video, tài liệu và mô tả nhiệm vụ | Kết nối các thành phần của bài học |
| Thảo luận | Bình luận gốc, phản hồi và thông tin liên quan | Hỗ trợ trao đổi học thuật |
| Hoạt động hệ thống | Các sự kiện truy cập hoặc thao tác được lựa chọn ghi nhận | Theo dõi sử dụng và hỗ trợ phân tích |

Bảng trên mô tả mô hình dữ liệu ở mức khái niệm, không khẳng định tên bảng, tên bộ sưu tập hoặc cấu trúc lưu trữ cụ thể của phiên bản phần mềm. Khi hoàn thiện báo cáo kỹ thuật, cần đối chiếu mô hình này với cấu trúc dữ liệu thực tế.

Trong nghiên cứu phương pháp dạy học, việc thu thập dữ liệu cần xuất phát từ câu hỏi nghiên cứu. Chẳng hạn, nếu mục tiêu là xem xét mức độ chủ động trước giờ lên lớp, nhà nghiên cứu cần xác định thế nào là một lượt truy cập có ý nghĩa, thế nào là hoàn thành nhiệm vụ và khoảng thời gian theo dõi phù hợp. Số lượt mở một trang web không đồng nghĩa với thời gian học tập thực chất hoặc mức độ hiểu bài.

Đồng thời, dữ liệu tài khoản và hoạt động của học sinh cần được thu thập ở mức cần thiết, có quy định về quyền truy cập, thời hạn lưu trữ và cách sử dụng. Khi dữ liệu được dùng trong báo cáo nghiên cứu, cần hạn chế thông tin nhận dạng trực tiếp và tuân thủ các yêu cầu về quyền riêng tư, đặc biệt khi đối tượng nghiên cứu là học sinh chưa thành niên.

## X.7. Kiểm thử và đánh giá khả năng vận hành

Kiểm thử là bước cần thiết để xác định website có thực hiện đúng các chức năng đã thiết kế trước khi đưa vào sử dụng trong hoạt động dạy học hoặc thực nghiệm sư phạm. Việc kiểm thử cần tập trung cả vào tính đúng đắn của chức năng lẫn khả năng sử dụng trong bối cảnh giáo dục.

### X.7.1. Kiểm thử chức năng

Các trường hợp kiểm thử cần bao gồm những thao tác thường gặp của từng nhóm người dùng. Bảng dưới đây đề xuất những tiêu chí cần xác minh; trạng thái đạt hay không đạt phải được điền sau khi thực hiện kiểm thử trên phiên bản thực tế.

| Chức năng | Trường hợp kiểm thử | Tiêu chí chấp nhận |
|---|---|---|
| Truy cập bài học | Người dùng mở một bài học đã xuất bản | Nội dung và các tài nguyên liên quan hiển thị đúng |
| Quản lý bài học | Giáo viên tạo hoặc cập nhật nội dung | Hệ thống xử lý đúng thao tác và trạng thái bài học |
| Video bài giảng | Mở trang có video nhúng | Video hiển thị theo thiết kế hoặc có thông báo phù hợp khi không thể tải |
| Tài liệu bổ trợ | Mở liên kết tài liệu | Liên kết đúng và quyền truy cập được cấu hình phù hợp |
| Thảo luận | Học sinh đăng câu hỏi và phản hồi | Nội dung được xử lý và hiển thị đúng cấu trúc |
| Phân quyền | Người dùng truy cập chức năng ngoài quyền hạn | Hệ thống từ chối thao tác không được phép |
| Quản lý nội dung | Người có quyền kiểm duyệt xử lý bình luận | Thao tác được thực hiện đúng quyền và quy tắc hệ thống |
| Tương thích giao diện | Sử dụng trên máy tính và điện thoại | Nội dung không bị che khuất và các thao tác chính có thể thực hiện |

Các trường hợp trên cần được kiểm thử với dữ liệu thông thường, dữ liệu thiếu hoặc không hợp lệ, cũng như những tình huống lỗi có thể phát sinh trong quá trình sử dụng. Đối với các thành phần phụ thuộc dịch vụ bên ngoài, cần kiểm tra cả tình huống đường dẫn không hợp lệ hoặc tài nguyên không thể truy cập.

### X.7.2. Kiểm thử khả năng sử dụng

Bên cạnh kiểm thử chức năng, cần xem xét mức độ thuận tiện khi giáo viên và học sinh sử dụng website. Đối với giáo viên, các tiêu chí quan trọng bao gồm khả năng tạo bài học, cập nhật nội dung và quản lý tài nguyên mà không phải thực hiện quá nhiều thao tác phức tạp.

Đối với học sinh, cần đánh giá khả năng tìm bài học, hiểu hướng dẫn, xác định nhiệm vụ và gửi câu hỏi. Các vấn đề như văn bản khó đọc, liên kết không rõ mục đích, thao tác không nhất quán hoặc giao diện hiển thị không phù hợp trên màn hình nhỏ cần được ghi nhận và điều chỉnh.

Có thể sử dụng phương pháp quan sát thao tác, phỏng vấn ngắn hoặc bảng hỏi về tính dễ sử dụng để thu thập ý kiến. Kết quả đánh giá cần được báo cáo dựa trên dữ liệu đã thu thập; không nên kết luận website thân thiện hoặc dễ sử dụng chỉ dựa trên nhận định của nhóm phát triển.

### X.7.3. Kiểm thử bảo mật và quyền truy cập

Do website phục vụ hoạt động học tập và có thể chứa thông tin của học sinh, kiểm thử cần chú ý đến cơ chế xác thực, phân quyền, khả năng truy cập trái phép và xử lý nội dung do người dùng cung cấp.

Các tình huống cần xem xét gồm truy cập trang quản lý bằng tài khoản học sinh, sửa nội dung bài học khi không có quyền, gửi dữ liệu đầu vào không hợp lệ và thao tác với nội dung thảo luận không phù hợp. Hệ thống cũng cần tránh công khai thông tin cá nhân hoặc dữ liệu hoạt động không cần thiết.

Việc kiểm thử cần được thực hiện trên phiên bản triển khai thực tế và ghi nhận đầy đủ điều kiện, kết quả, lỗi phát hiện cùng phương án xử lý. Khi chưa có nhật ký kiểm thử hoặc kết quả xác minh, báo cáo chỉ nên trình bày tiêu chí và quy trình dự kiến, không khẳng định hệ thống đã đạt mức bảo mật hoặc độ tin cậy cụ thể.

## X.8. Khai thác website trong nghiên cứu phương pháp giảng dạy

Sau khi các chức năng cần thiết được kiểm thử và xác nhận, website có thể được sử dụng làm môi trường hỗ trợ tổ chức nghiên cứu sư phạm. Quá trình khai thác cần gắn với một câu hỏi nghiên cứu cụ thể, chẳng hạn xem xét sự thay đổi về mức độ chuẩn bị bài, chất lượng tương tác hoặc kết quả học tập khi áp dụng mô hình Lớp học đảo ngược.

Để đánh giá có cơ sở, nhà nghiên cứu cần xây dựng bộ tiêu chí và xác định phương pháp thu thập minh chứng trước khi triển khai. Các nguồn dữ liệu có thể bao gồm:

- Dữ liệu sử dụng website, như lượt truy cập học liệu hoặc hoạt động thảo luận, nếu hệ thống thực tế có ghi nhận các thông tin này.
- Bài kiểm tra trước và sau quá trình tác động nhằm đánh giá sự thay đổi về kết quả học tập.
- Bảng hỏi hoặc phỏng vấn nhằm tìm hiểu cảm nhận, mức độ thuận tiện và khó khăn của người học.
- Phiếu quan sát hoặc nhật ký giảng dạy nhằm ghi nhận hoạt động học tập trong lớp.

Nếu nghiên cứu sử dụng nhóm thực nghiệm và nhóm đối chứng, cần mô tả rõ cách lựa chọn nhóm, đặc điểm người tham gia, thời lượng tác động, nội dung dạy học và phương pháp đánh giá. Khi có đủ dữ liệu phù hợp, nhà nghiên cứu có thể sử dụng thống kê mô tả và các phép kiểm định được lựa chọn theo thiết kế nghiên cứu để phân tích kết quả.

Đặc biệt, không nên đồng nhất sự cải thiện điểm số với tác động riêng biệt của website. Kết quả còn có thể chịu ảnh hưởng bởi nội dung bài học, cách tổ chức hoạt động, năng lực giáo viên, thời lượng học tập và đặc điểm ban đầu của người học. Vì thế, việc diễn giải kết quả cần xem xét bối cảnh nghiên cứu và những giới hạn của thiết kế thực nghiệm.

Như vậy, đóng góp của website đối với nghiên cứu sư phạm không chỉ nằm ở khả năng phân phối học liệu mà còn ở việc tạo ra một môi trường tổ chức hoạt động học tập có cấu trúc, hỗ trợ thu thập minh chứng và tăng tính nhất quán khi triển khai phương pháp dạy học.

## X.9. Hạn chế và định hướng phát triển

Mặc dù website có thể hỗ trợ tổ chức học tập theo mô hình Lớp học đảo ngược, việc triển khai vẫn tồn tại một số hạn chế cần được xem xét.

Thứ nhất, khả năng tiếp cận học liệu phụ thuộc vào thiết bị và kết nối Internet của người học. Nếu học sinh không có điều kiện truy cập ổn định, yêu cầu tự học trực tuyến trước giờ lên lớp có thể tạo ra sự chênh lệch về cơ hội học tập. Vì vậy, khi áp dụng thực tế cần xem xét giải pháp học liệu thay thế hoặc phương thức hỗ trợ phù hợp.

Thứ hai, website không tự động bảo đảm chất lượng sư phạm của tài nguyên. Video, nội dung lý thuyết và bài tập vẫn cần được giáo viên lựa chọn hoặc biên soạn theo mục tiêu và yêu cầu cần đạt của bài học. Một nền tảng có đầy đủ chức năng nhưng nội dung thiếu mạch lạc hoặc nhiệm vụ chưa phù hợp vẫn có thể không đạt mục tiêu dạy học.

Thứ ba, dữ liệu sử dụng website chỉ phản ánh một phần hoạt động của người học. Việc mở video hoặc truy cập tài liệu không đồng nghĩa với việc người học đã tiếp nhận và hiểu nội dung. Muốn đánh giá năng lực học tập, cần kết hợp nhiều nguồn minh chứng.

Trong các giai đoạn tiếp theo, hệ thống có thể được phát triển theo hướng bổ sung chức năng theo dõi tiến độ học tập, tích hợp câu hỏi tự đánh giá trực tiếp, hỗ trợ giáo viên tổng hợp câu hỏi thường gặp và cải thiện công cụ quản lý học liệu. Mỗi chức năng mới cần được xem xét dựa trên nhu cầu thực tế của giáo viên và người học, đồng thời đánh giá tính hữu ích trước khi mở rộng phạm vi triển khai.

## X.10. Kết luận chương

Chương này đã trình bày quá trình phân tích yêu cầu, thiết kế kiến trúc logic và triển khai các chức năng chính của website hỗ trợ tổ chức dạy học theo mô hình Lớp học đảo ngược. Các chức năng trọng tâm bao gồm quản lý bài học, trình bày video, biên soạn nội dung lý thuyết, liên kết tài liệu bổ trợ, tổ chức thảo luận và quản lý người dùng theo vai trò.

Việc tổ chức những chức năng này theo cấu trúc bài học thống nhất nhằm kết nối hoạt động tự học trước giờ lên lớp với các hoạt động vận dụng, trao đổi và củng cố kiến thức trong quá trình dạy học. Đồng thời, hệ thống có thể cung cấp một số dữ liệu hỗ trợ theo dõi hoạt động học tập và phục vụ nghiên cứu, với điều kiện việc thu thập, xử lý và diễn giải dữ liệu được thực hiện theo phương pháp phù hợp.

Tuy nhiên, sự hoàn thiện về mặt kỹ thuật không đồng nghĩa với việc phương pháp dạy học đã được chứng minh là hiệu quả. Website cần được kiểm thử trong môi trường sử dụng thực tế và đánh giá thông qua một thiết kế nghiên cứu sư phạm phù hợp. Đây là cơ sở để phân biệt đóng góp về công nghệ của hệ thống với bằng chứng về hiệu quả giáo dục, đồng thời xác định những hướng cải tiến tiếp theo dựa trên dữ liệu và phản hồi thực tế.