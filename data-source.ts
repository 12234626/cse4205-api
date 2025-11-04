import { DataSource, DataSourceOptions } from 'typeorm';

import typeormConfig from 'src/config/typeorm.config';

export default new DataSource(typeormConfig() as DataSourceOptions);
