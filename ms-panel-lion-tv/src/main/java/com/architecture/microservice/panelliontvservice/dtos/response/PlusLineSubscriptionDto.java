package com.architecture.microservice.panelliontvservice.dtos.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class PlusLineSubscriptionDto {
    private Long subscriptionId;
    private Long customerId;
    private String status;
    private String startDate;
    private String renewalDate;
    private Double amount;
    private Double discount;
    private String linePlusId;
    private String lineCountry;
}
