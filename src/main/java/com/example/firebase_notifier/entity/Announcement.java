package com.example.firebase_notifier.entity;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
public class Announcement {
    private String title;
    private String content;
    private String timestamp;

    @Override
    public String toString() {
        return "Announcement{" +
                "title='" + title + '\'' +
                ", content='" + content + '\'' +
                ", timestamp='" + timestamp + '\'' +
                '}';
    }
}