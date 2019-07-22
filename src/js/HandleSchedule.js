export function hashHour(hour) {
    switch (hour) {
        case 1: case '1':
            return '07:00:00';
        case 2: case '2':
            return '09:00:00';
        case 3: case '3':
            return '11:00:00';
        case 4: case '4':
            return '13:00:00';
        case 5: case '5':
            return '14:00:00';
        case 6: case '6':
            return '16:00:00';
        case 7: case '7':
            return '18:00:00';
        case 8: case '8':
            return '20:00:00';
        case 9: case '9':
            return '21:00:00';
        default:
            break;
    }
}

export function hashDay(day) {
    switch (day) {
        case 1: case '1':
            return 'lunes';
        case 2: case '2':
            return 'martes';
        case 3: case '3':
            return 'miercoles';
        case 4: case '4':
            return 'jueves';
        case 5: case '5':
            return 'viernes';
        case 6: case '6':
            return 'sabado';
        default:
            break;
    }
}

export function unhashHour(hour) {
    switch (hour) {
        case '07:00:00':
            return 1;
        case '09:00:00':
            return 2;
        case '11:00:00':
            return 3;
        case '13:00:00':
            return 4;
        case '14:00:00':
            return 5;
        case '16:00:00':
            return 6;
        case '18:00:00':
            return 7;
        case '20:00:00':
            return 8;
        case '21:00:00':
            return 9;
        default:
            break;
    }
}

export function unhashDay(day) {
    switch (day) {
        case 'lunes':
            return 1;
        case 'martes':
            return 2;
        case 'miercoles':
            return 3;
        case 'jueves':
            return 4;
        case 'viernes':
            return 5;
        case 'sabado':
            return 6;
        default:
            break;
    }
}

export function findSchedule(schedules, time_from, time_to, day) {
    var schedule;
    for (schedule of schedules) {
        var old_time_from = unhashHour(schedule.time_from)
        var old_time_to = unhashHour(schedule.time_to)
        var new_time_from = time_from >= old_time_from && time_from < old_time_to;
        var new_time_to = time_to > old_time_from && time_to <= old_time_to;
        if ((new_time_from || new_time_to) && schedule.day === hashDay(day)) {
            return false;
        }
    }
    return true;
}