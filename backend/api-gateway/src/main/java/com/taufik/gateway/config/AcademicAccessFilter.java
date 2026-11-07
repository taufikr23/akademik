package com.taufik.gateway.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.cloud.gateway.route.Route;
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
@Order(-10)
public class AcademicAccessFilter implements GlobalFilter {
    private final WebClient auth;

    public AcademicAccessFilter(WebClient.Builder builder,
            @Value("${auth.service.url:http://auth-service:8082}") String url) {
        this.auth = builder.baseUrl(url).build();
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        Route route = exchange.getRequiredAttribute(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR);
        if ("auth-service".equals(route.getId())) {
            return chain.filter(exchange);
        }
        String bearer = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (bearer == null || !bearer.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
        return auth.get().uri("/api/auth/me").header(HttpHeaders.AUTHORIZATION, bearer)
                .exchangeToMono(response -> Mono.just(response.statusCode()))
                .onErrorReturn(HttpStatus.SERVICE_UNAVAILABLE)
                .flatMap(status -> {
                    if (status.is2xxSuccessful()) {
                        return chain.filter(exchange);
                    }
                    exchange.getResponse().setStatusCode(status.is4xxClientError()
                            ? HttpStatus.UNAUTHORIZED : HttpStatus.SERVICE_UNAVAILABLE);
                    return exchange.getResponse().setComplete();
                });
    }
}
