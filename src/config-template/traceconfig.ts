import { config } from './config'
import { tags } from './tags'

export interface traceconfig {
	config: config,
	options: {
		tags: tags
	}
}