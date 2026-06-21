package com.airbnb.clone.Chat.dto;

import lombok.Data;

@Data
public class ChatMessageDto {
    private String sender; // "host" or "guest"
    private String text;
    private Long bookingId;
    private String time;
}
