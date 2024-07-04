package com.example.firebase_notifier.controller;

import com.example.firebase_notifier.entity.Announcement;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    @PostMapping
    public void receiveAnnouncement(@RequestBody Announcement message) {
        System.out.println("=== 공지사항 ===");
        System.out.println("공지사항 제목: " + message.getTitle());
        System.out.println("공지사항 내용: " + message.getContent());
        System.out.println("작성자: " + message.getAuthor());
        System.out.println("타임스탬프: " + message.getTimestamp());
    }
}
