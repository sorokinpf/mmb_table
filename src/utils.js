
const zip = (...rows) => [...rows[0]].map((_,c) => rows.map(row => row[c]));

const cell_table = {'part_result': 'Результат на отрезке',
					'lag': 'Отставание на отрезке',
					'coef': 'Коэффициент на отрезке',
					'summ_lag': 'Суммарное отставание после отрезка',
					'place': 'Место на отрезке',
					'total_result': 'Суммарный результат после отрезка',
					'total_place': 'Место после отрезка',
					'path': 'Порядок КП на участке выбора'};

export {zip,cell_table};