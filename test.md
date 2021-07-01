# Тестовое задание Node.js Backend Developer

Необходимо реализовать сервис с API для записи человека на прием к врачу, и напоминанием за 2 часа до приема

В БД можно сделать сделать следующие коллекции
### Users:
```
{
    id: 'uuid',
    phone: '+7 926 578 85 14',
    name: 'Уася',
    ...anything
}
```
### Doctors:
```
{
    id: 'uuid',
    name: 'Болодя',
    spec: 'Терапевт',
    // Свободные слоты для записи (можно сделать массив объектов, либо просто DateTime)
    slots: ['date_time', 'date_time'],
    ...anything
}
```

По сути нужен метод API для записи человека на прием, на вход отдаем
1. ID Пользователя
2. ID Доктора
3. Слот на который хотим записаться
```
{
    user_id: 'askd90pajsdpojas',    
    doctor_id: 'a987astgydioaushd9a0sdhy',
    slot: 'date_time',
    ...anything
}
```
Требования
- На один слот может записаться только один человек
- При попытке записаться на невозможное время будет возвращаться ошибка


## Сервис оповещений
Также нужен сервис который будет оповещать пользователя:
- за 1 день до приема
- за 2 часа до приема

Сам сервис пусть просто логирует сообщения в .log файл:
```
{{ current_date }} | Привет {{ user.name }}! Напоминаем что вы записаны к {{ doctor.spec }} завтра в {{ slot.time }}!
{{ current_date }} | Привет {{ user.name }}! Вам через 2 часа к {{ doctor.spec }} в {{ slot.time }}!
```

Если для реализации понадобиться чтото еще (методы/коллекции/...anything), то добавляй, это скорее не требование а пожелания

# Требования:
- Миграции. Для работы сервиса, надо предзаполнить БД (users/doctors), можно сделать отдельную команду `npm run prefill`
- Для сборки проекта достаточно выполнить `npm i && npm run dev`, при желании можно завернуть все докеры, в общем сборка должна работать из коробки. Если будет чтото не тривиальное описать в `README.md` в корне проекта.

## Cтэк
- Koa 2
- mongodb
- monoose