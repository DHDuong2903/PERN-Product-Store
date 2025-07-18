import arcjet, { tokenBucket, shield, detectBot } from "@arcjet/node";

import dotenv from "dotenv";
dotenv.config();

// Init arcjet

export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"], // Sử dụng địa chỉ IP của client người đang dùng để phân biệt người dùng
  rules: [
    // Shield bảo vệ ứng dụng của bạn khỏi các cuộc tấn công phổ biến: SQL Injection, XSS, CSRF, và các cuộc tấn công từ chối dịch vụ (DoS).
    shield({ mode: "LIVE" }),

    // Phát hiện bot và các hành vi đáng ngờ
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE", // Cho phép các con bot tìm kiếm từ Google hoạt động
      ],
    }),

    // Giới hạn gửi request
    tokenBucket({
      mode: "LIVE",
      refillRate: 30, // Mỗi người sẽ được nạp 30 token
      interval: 5, // Sau mỗi 5s, sẽ nạp 30 token vào bucket
      capacity: 20, // Mỗi người có 20 request trong bucket
    }),
  ],
});
