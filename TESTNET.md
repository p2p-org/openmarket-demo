# dgaming market testnet

## setup

1. установить docker и docker-compose
1. склонировать репозитории [dwh](https://github.com/dgamingfoundation/dwh) (ветка master), [market](https://github.com/dgamingfoundation/marketplace/tree/develop) (ветка develop) в одну директорию, и репозиторий [dgaming-market-demo](https://github.com/dgamingfoundation/dgaming-market-demo)(ветка master), можно в ту же папку 
1. переходим в директорию `dwh` и запускаем
   ```bash
    $ ./localnet.sh rebuild-all
    $ ./localnet.sh up
    $ ./localnet.sh seed     
   ```
   это сбилдит контейнеры, запустит их и произведет начальное заполнение nft
1. **важный момент!** graphql сервер стартует чуть раньше, чем заполняется структура БД, поэтом надо на том хосте, где поднимаем контейнеры перейти в вебморду graphql консоли, она на порту 8080 (типа http://hostname:8080), и на квладке `DATA` кликнуть две кнопки `Track All` (восзле списка таблиц и возле списка связей) 
1. переходим в директорию `dgaming-market-demo` и запускаем
   ```bash
    $ ./docker-compose up -d
   ```
   это сбилдит контейнер фронта, запустит его и nginx proxy на 80 порту 
1. можно переходить на url хоста в браузере 
