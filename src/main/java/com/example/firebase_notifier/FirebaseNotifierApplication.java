package com.example.firebase_notifier;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class FirebaseNotifierApplication {

	public static void main(String[] args) {
		SpringApplication.run(FirebaseNotifierApplication.class, args);
	}
}
