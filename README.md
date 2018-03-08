# ZTProductionTools
枕头生产蓝牙固件测试工具

## 作用

* 电压测试
* 板级基本功能测试
* 气压校准功能测试
* 充放气功能测试
* 校准测试

## TODO

* 枕头命令操作的过程中，弹出Modal等待
* 自动连接
* NavigationBar在安卓上不居中的问题
* NavigationBar如何隐藏的实现
* 蓝牙部分独立出来

## Build

1. clone this repo
2. npm install
3. react-native run-android or react-native run-ios

## release

0. cd 项目根目录
1. keytool -genkey -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
2. mv my-release-key.keystore android/app/
3. 修改android/gradle.properties文件，增加如下

```
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=xx
MYAPP_RELEASE_KEY_PASSWORD=xx
[注意替换xx为你自己设置的密钥和存储密码]
```

4. 修改android/app/build.gradle文件中的签名配置：

```
...
android {
  ...
  defaultConfig {
    ...
  }
  signingConfigs {
    release {
        storeFile file(MYAPP_RELEASE_STORE_FILE)
        storePassword MYAPP_RELEASE_STORE_PASSWORD
        keyAlias MYAPP_RELEASE_KEY_ALIAS
        keyPassword MYAPP_RELEASE_KEY_PASSWORD
    }
  }
  buildTypes {
    release {
      ...
      signingConfig signingConfigs.release
    }
  }
}
```

5. cd android
6.  ./gradlew assembleRelease
7. open app/build/outputs/apk/