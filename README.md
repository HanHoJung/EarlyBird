# 사용자 참여형 미세먼지 앱



## 프로젝트 소개

현재, 초미세먼지가 사람들의 건강을 위협하고 있습니다. 그러나 현재 환경관련 어플리케이션은 시, 구역 단위의 미세먼지 정보만 제공하고 있습니다. 때문에, 사람들이 현재 위치해 있는 곳의 공기의 질을 측정할 수 없는 방법이 없었습니다. 이를 해겨하기 위해 오픈소스 HW와 웹/앱 기술을 적용하여 문제를 해결하도록 하였습니다. 



## 개발배경 및 필요성

최근 미세먼지 문제는 국가, 사회적으로 가장 큰 문제 중 하나로 대두되었다. 그러나 현재 광역 지역 단위의 미세먼지 관련 정보는 다양한 서비스를 통해 제공되고 있으나 그 지역 내의 특정 위치 또는 건물 내부의 미세먼지 정보에 대해서는 상당히 제한적으로 서비스 되고 있는 수준이다. 이에 미세먼지를 측정할 수 있는 간단한 장비를 제작하고 이로부터 수집한 미세먼지 정보를 참여자들 간에 상호 교환하여 보다 구체적이고 정확한 정보를 알 수 있도록 하는 데에 목적이 있다.



## 작품의 기대효과 및 활용분야

1. 정보 제공 범위의 확대 – 기존의 지역 단위 미세먼지 정보 제공을 뛰어넘어 구체적    인 장소, 실내 공간에서 측정된 미세먼지 정보를 제공할 수 있음

  ​    

2. 공공성의 확대 – 단순한 수익 창출을 위한 콘텐츠보다는 사용자들이 직접 참여하여    만들어지는 신뢰성 있는 미세먼지 정보를 제공하는 콘텐츠임 

  ​    

3. 기술의 확대 - 단순 API연동이 아니라 플랫폼을 구축하고 이를 확산하여 AI 등과도    연계시킬 수 있는 기술적인 확대의 토대가 될 서비스의 구축


​      

| 구분          | 항목                   | 적용내역                                  |                           |
| ------------- | ---------------------- | ----------------------------------------- | ------------------------- |
| S/W개발환경   | OS                     | centos                                    | 서버 호스팅용 os로 사용   |
| 개발환경(IDE) | vscode, eduino         | 효율적인 코드 작성을 위해 적용            |                           |
| 개발도구      | git                    | 산출물 형상관리 및 버전 관리              |                           |
| 개발언어      | java, javascript, html | 웹/앱으로 개발하였기 때문에 해당 언어적용 |                           |
| H/W구성장비   | 디바이스               | arduino                                   | 전체적인 서비스를 위한 HW |
| 센서          | GP2Y1010AU0F           | PM2.5 미세먼지 측정                       |                           |
| 통신          | blutooth               | HW와 앱 간의 블루투스 통신                |                           |
| 개발언어      | C                      | HW 제어 기능 적용                         |                           |