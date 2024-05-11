from enum import Enum


class Roles(str, Enum):
    ADMIN = "admin"
    USER = "user"


class Sort(str, Enum):
    ID = "id"
    USERNAME = "username"
    CREATE_DATE = "create_date"
    UPDATE_DATE = "update_date"


class Order(str, Enum):
    ASC = "asc"
    DESC = "desc"


class Education(Enum):
    HIGH_SCHOOL = 'Среднее профессиональное'
    BACHELOR = 'Бакалавриат'
    MASTER = 'Магистратура'


class City(Enum):
    MOSCOW = 'Москва'
    SAINT_PETERSBURG = 'Санкт-Петербург'
    MINSK = 'Минск'


class Language(Enum):
    ENG = 'Английский'
    RUS = 'Русский'


class Hard(Enum):
    JAVASCRIPT = 'JavaScript'
    TYPESCRIPT = 'TypeScript'
    SQL = 'SQL'
    REACTJS = 'React.js'


class Soft(Enum):
    COMMUNICATION = 'Коммуникация'
    CREATIVITY = 'Творчество'
    LEADERSHIP = 'Лидерство'


class Country(Enum):
    RUSSIA = 'Россия'
    BELARUS = 'Беларусь'


class Industry(Enum):
    SOFTWARE = 'Программное обеспечение'
    TELECOM = 'Телекоммуникации'
    CYBERSECURITY = 'Кибербезопасность'
    VIDEO_GAMES = 'Видеоигры'
    CLOUD_SERVICES = 'Облачные сервисы'
    FINANCE = 'Финансы'


class Experience(Enum):
    JUNIOR = 'Junior'
    MIDDLE = 'Middle'
    SENIOR = 'Senior'
    NO_EXP = 'Без опыта'
