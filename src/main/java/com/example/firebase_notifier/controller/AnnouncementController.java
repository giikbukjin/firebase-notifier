package com.example.firebase_notifier.controller;

import com.example.firebase_notifier.entity.Announcement;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/announcements")
public class AnnouncementController {

    @PostMapping
    public void receiveAnnouncement(@RequestBody Announcement message) {
        System.out.println("Received Announcement: " + message);
    }
}
