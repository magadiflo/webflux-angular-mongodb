package dev.magadiflo.app.api;

import dev.magadiflo.app.model.ItemStatus;
import lombok.*;

import java.time.Instant;

@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Setter
@Getter
public class ItemResource {
    private String id;
    private String description;
    private ItemStatus status;
    private Long version;
    private Instant createdDate;
    private Instant lastModifiedDate;
}
