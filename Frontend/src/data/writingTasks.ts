import type { ExamLevel } from "@/types/exam";

export interface WritingTask {
  id: string;
  level: ExamLevel;
  type: string;
  title: string;
  description: string;
  requirements: string;
  minWords: number;
  maxWords: number;
  timeLimit: number; // minutes
  hints: string[];
  sampleAnswer?: string;
}

export const WRITING_TASKS: WritingTask[] = [
  {
    id: "b1-email-1",
    level: "B1",
    type: "email",
    title: "Viết email xin nghỉ phép",
    description:
      "Bạn cần xin nghỉ phép 3 ngày vì lý do gia đình. Viết email gửi cho quản lý của bạn.",
    requirements:
      "Viết email trang trọng, nêu rõ lý do xin nghỉ, thời gian nghỉ dự kiến và đề xuất công việc thay thế.",
    minWords: 120,
    maxWords: 150,
    timeLimit: 20,
    hints: [
      "Mở đầu bằng lời chào trang trọng (Dear Mr/Ms...)",
      "Nêu rõ ngày bắt đầu và kết thúc kỳ nghỉ",
      "Đề cập đến công việc đang làm và ai sẽ thay thế",
    ],
    sampleAnswer:
      "Dear Mr. Nguyen,\n\nI am writing to request a leave of absence from [date] to [date] due to family matters that require my attention.\n\nI have arranged for my colleague, Minh, to cover my responsibilities during this period. I will ensure all urgent tasks are completed before my departure.\n\nI would be grateful if you could approve this request. Please let me know if you need any further information.\n\nYours sincerely,\n[Your name]",
  },
  {
    id: "b1-desc-1",
    level: "B1",
    type: "description",
    title: "Mô tả một ngày đi làm của bạn",
    description:
      "Viết một đoạn văn ngắn mô tả một ngày đi làm điển hình của bạn.",
    requirements:
      "Mô tả các hoạt động từ sáng đến chiều, sử dụng thì hiện tại đơn và các từ nối thời gian.",
    minWords: 120,
    maxWords: 150,
    timeLimit: 15,
    hints: [
      "Bắt đầu với thời gian thức dậy và chuẩn bị",
      "Mô tả quá trình đi làm",
      "Nêu các công việc chính trong ngày",
    ],
  },
  {
    id: "b2-essay-1",
    level: "B2",
    type: "essay",
    title: "Đồng ý hay không: Học online hiệu quả hơn học trực tiếp",
    description:
      "Nhiều người cho rằng học trực tuyến hiệu quả hơn học tại trường. Bạn đồng ý hay không? Hãy nêu ý kiến của bạn.",
    requirements:
      "Viết bài luận 250-300 từ. Nêu quan điểm rõ ràng, đưa ra 2-3 lý do và ví dụ minh họa. Kết luận tóm tắt ý chính.",
    minWords: 250,
    maxWords: 300,
    timeLimit: 40,
    hints: [
      "Mở bài: Nêu chủ đề và quan điểm của bạn",
      "Thân bài: Mỗi đoạn một ý chính với ví dụ",
      "Kết bài: Tóm tắt và nhấn mạnh quan điểm",
    ],
    sampleAnswer:
      "In recent years, online learning has become increasingly popular. While some argue it is more effective than traditional classroom learning, I believe both have their merits.\n\nOn one hand, online learning offers flexibility. Students can study at their own pace and access materials anytime. This is particularly beneficial for working adults. Furthermore, online platforms often provide a wide range of resources and interactive tools.\n\nOn the other hand, face-to-face learning promotes better interaction. Students can ask questions immediately and engage in discussions. The physical presence of a teacher can also motivate learners. Moreover, some subjects require hands-on practice which is difficult to replicate online.\n\nIn conclusion, the effectiveness depends on the subject and the learner's style. A blended approach might be the best solution for many.",
  },
  {
    id: "b2-letter-1",
    level: "B2",
    type: "letter",
    title: "Thư phàn nàn về dịch vụ",
    description:
      "Bạn vừa mua sản phẩm trực tuyến nhưng nhận được hàng bị hỏng. Viết thư phàn nàn và yêu cầu hoàn tiền hoặc đổi hàng.",
    requirements:
      "Viết thư trang trọng 200-250 từ. Nêu rõ thông tin đơn hàng, mô tả vấn đề, và yêu cầu cụ thể.",
    minWords: 200,
    maxWords: 250,
    timeLimit: 30,
    hints: [
      "Bao gồm số đơn hàng và ngày mua",
      "Mô tả chi tiết tình trạng hàng khi nhận",
      "Yêu cầu rõ ràng: hoàn tiền hoặc đổi hàng mới",
    ],
  },
  {
    id: "c1-essay-1",
    level: "C1",
    type: "discursive",
    title: "Vai trò của chính phủ trong việc kiểm soát ô nhiễm môi trường",
    description:
      "Ô nhiễm môi trường đang là vấn đề toàn cầu. Một số người cho rằng chính phủ nên có vai trò chính trong việc giải quyết. Số khác tin rằng cá nhân và doanh nghiệp phải chịu trách nhiệm nhiều hơn. Thảo luận cả hai quan điểm và đưa ra ý kiến của bạn.",
    requirements:
      "Viết bài luận discursive 350-400 từ. Trình bày cả hai quan điểm một cách cân bằng, sau đó nêu ý kiến cá nhân có lập luận chặt chẽ.",
    minWords: 350,
    maxWords: 400,
    timeLimit: 50,
    hints: [
      "Đoạn 1: Giới thiệu vấn đề và hai quan điểm",
      "Đoạn 2-3: Phân tích từng quan điểm với dẫn chứng",
      "Đoạn 4: Ý kiến cá nhân và kết luận",
    ],
    sampleAnswer:
      "Environmental pollution has emerged as one of the most pressing challenges of the 21st century. While governments are often seen as the primary actors in addressing this issue, there is ongoing debate about whether they should bear the main responsibility or if individuals and corporations should play a greater role.\n\nThose who advocate for government-led solutions argue that only state authorities have the power to enforce regulations and impose penalties. Legislation such as emissions standards and plastic bag bans can effect change on a national scale. Furthermore, governments can invest in green technology and infrastructure that private entities might not prioritise.\n\nConversely, others contend that individual and corporate responsibility is equally crucial. Consumers drive demand; their choices can incentivise sustainable practices. Similarly, businesses that adopt eco-friendly operations can influence entire industries. Without public cooperation, government policies may prove ineffective.\n\nIn my view, a collaborative approach is essential. Governments must set the framework through legislation and incentives, while citizens and companies must actively participate. Neither can succeed in isolation. Only through combined efforts can we hope to mitigate environmental degradation.",
  },
  {
    id: "c1-report-1",
    level: "C1",
    type: "report",
    title: "Báo cáo: Xu hướng làm việc từ xa tại công ty bạn",
    description:
      "Công ty bạn đang xem xét mở rộng chính sách làm việc từ xa. Bạn được yêu cầu viết báo cáo phân tích xu hướng hiện tại và đưa ra khuyến nghị.",
    requirements:
      "Viết báo cáo 300-350 từ. Cấu trúc rõ ràng với các phần: Introduction, Findings, Recommendations. Sử dụng ngôn ngữ trang trọng, khách quan.",
    minWords: 300,
    maxWords: 350,
    timeLimit: 45,
    hints: [
      "Introduction: Mục đích và phạm vi báo cáo",
      "Findings: Số liệu, ý kiến nhân viên, so sánh trước/sau",
      "Recommendations: Đề xuất cụ thể, có thể đánh số",
    ],
  },
];
