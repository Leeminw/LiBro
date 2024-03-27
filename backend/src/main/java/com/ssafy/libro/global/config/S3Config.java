package com.ssafy.libro.global.config;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class S3Config {

    @Value("${cloud.aws.credentials.access-key}")
    private String accessKey;

    @Value("${cloud.aws.credentials.secret-key}")
    private String secretKey;

    @Value("${cloud.aws.region.static}")
    private String region;

    /* 통계적으로 일반적이고 정석적으로 사용되는 코드
    * AmazonS3 인터페이스를 리턴 타입으로 사용하는 방식은 더 유연하며,
    * 인터페이스를 통한 접근은 구현체에 대한 의존성을 줄여주기 때문에 좋은 프로그래밍 관례로 간주됩니다.
    * 이를 통해, 코드의 결합도를 낮추고, 테스트 용이성을 높이며, 필요에 따라 다른 구현체로 쉽게 전환할 수 있는 유연성을 제공합니다.
    * 추후에 AWS SDK의 업데이트나 다른 구현체로의 전환을 용이하게 합니다.
    * 가능한 한 인터페이스를 통해 접근하는 것이 좋은 소프트웨어 설계 원칙에 부합합니다. */
    @Bean
    public AmazonS3 amazonS3() {
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKey, secretKey);
        return AmazonS3ClientBuilder.standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(region)
                .build();
    }

}
