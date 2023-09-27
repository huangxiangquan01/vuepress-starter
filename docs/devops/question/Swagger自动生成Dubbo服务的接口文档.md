## 接入 Knife4j 作为 Swagger UI 界面
> https://blog.csdn.net/github_38592071/article/details/109759838

### 新增依赖
```pom
<--! https://github.com/YunaiV/swagger-dubbo -->
<dependency>
  <groupId>com.deepoove</groupId>
            <artifactId>swagger-dubbo</artifactId>
            <version>2.0.2-SNAPSHOT</version>
       </dependency>


<--! UI展示界面 -->
<dependency>
    <groupId>com.github.xiaoymin</groupId>
    <artifactId>knife4j-spring-boot-starter</artifactId>
    <version>2.0.5</version>
</dependency>
```

### 新增配置
```properties
swagger.dubbo.application.groupId=com.deepoove
swagger.dubbo.application.artifactId=dubbo-provider-springboot
swagger.dubbo.application.version=2.0.2-SNAPSHOT
```

### 3.2 创建 SwaggerConfiguration
创建 SwaggerConfiguration 配置类，自定义 SwaggerResourcesProvider Bean。代码如下：
```java
@Configuration
@EnableSwagger2 // 标记项目启用 Swagger API 接口文档
@EnableDubboSwagger
public class SwaggerConfiguration {
 
    @Bean
    @Primary
    public SwaggerResourcesProvider newSwaggerResourcesProvider(Environment env, DocumentationCache documentationCache) {
        return new InMemorySwaggerResourcesProvider(env, documentationCache) {
 
            @Override
            public List<SwaggerResource> get() {
                // 1. 调用 InMemorySwaggerResourcesProvider
                List<SwaggerResource> resources = super.get();
                // 2. 添加 swagger-dubbo 的资源地址
                SwaggerResource dubboSwaggerResource = new SwaggerResource();
                dubboSwaggerResource.setName("dubbo");
                dubboSwaggerResource.setSwaggerVersion("2.0");
                dubboSwaggerResource.setUrl("/swagger-dubbo/api-docs");
                dubboSwaggerResource.setLocation("/swagger-dubbo/api-docs"); // 即将废弃，和 url 属性等价。
                resources.add(0, dubboSwaggerResource);
                return resources;
            }
 
        };
    }
 
}
```