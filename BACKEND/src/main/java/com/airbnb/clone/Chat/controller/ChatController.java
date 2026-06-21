package com.airbnb.clone.Chat.controller;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.airbnb.clone.Chat.dto.ChatMessageDto;
import com.airbnb.clone.Chat.entity.ChatMessage;
import com.airbnb.clone.Chat.repository.ChatMessageRepository;

import lombok.RequiredArgsConstructor;

@RestController
@CrossOrigin
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository chatMessageRepository;

    @MessageMapping("/chat/{bookingId}")
    public void processMessage(@DestinationVariable Long bookingId, @Payload ChatMessageDto messageDto) {
        // Save to Database
        ChatMessage message = new ChatMessage();
        message.setBookingId(bookingId);
        message.setSender(messageDto.getSender());
        message.setText(messageDto.getText());
        message.setTimestamp(LocalDateTime.now());
        chatMessageRepository.save(message);

        // Format timestamp
        String timeStr = LocalTime.now().format(DateTimeFormatter.ofPattern("hh:mm a"));
        messageDto.setTime(timeStr);
        messageDto.setBookingId(bookingId);

        // Broadcast to channel
        messagingTemplate.convertAndSend("/topic/booking/" + bookingId, messageDto);
    }

    @GetMapping("/api/v1/chat/booking/{bookingId}")
    public ResponseEntity<List<ChatMessageDto>> getChatHistory(@PathVariable Long bookingId) {
        List<ChatMessage> history = chatMessageRepository.findByBookingIdOrderByTimestampAsc(bookingId);
        
        List<ChatMessageDto> dtos = history.stream().map(m -> {
            ChatMessageDto d = new ChatMessageDto();
            d.setBookingId(m.getBookingId());
            d.setSender(m.getSender());
            d.setText(m.getText());
            d.setTime(m.getTimestamp().toLocalTime().format(DateTimeFormatter.ofPattern("hh:mm a")));
            return d;
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }
}
