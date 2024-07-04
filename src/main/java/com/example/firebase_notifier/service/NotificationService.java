package com.example.firebase_notifier.service;

import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class NotificationService {

    public void sendNotificationToAllUsers(String title, String body) throws InterruptedException, ExecutionException {
        Message message = Message.builder()
                .setNotification(Notification.builder()
                        .setTitle(title)
                        .setBody(body)
                        .build())
                .setTopic("all")
                .build();

        String response = FirebaseMessaging.getInstance().sendAsync(message).get();
        System.out.println("Successfully sent message: " + response);
    }
}

