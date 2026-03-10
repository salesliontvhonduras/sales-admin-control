package com.architecture.microservice.panelliontvservice.controller;

import com.architecture.microservice.msmodulecommonsutil.api.ApiResponse;
import com.architecture.microservice.msmodulecommonsutil.api.ApiResponseEntityBuilder;
import com.architecture.microservice.panelliontvservice.dtos.response.PlusLineSubscriptionDto;
import com.architecture.microservice.panelliontvservice.services.interfaces.PlusLinesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/plus-lines")
@RequiredArgsConstructor
public class PlusLinesController {
  
    private final PlusLinesService plusLinesService;

    @GetMapping
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<ApiResponse<List<PlusLineSubscriptionDto>>> list(
            @RequestParam(required = false) String country,
            @RequestParam(required = false) String search
    ) {
        return ApiResponseEntityBuilder.build(plusLinesService.list(country, search));
    }
}
