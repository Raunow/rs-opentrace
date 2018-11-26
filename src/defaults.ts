export interface wrapperconfig{
	config: {
		serviceName: string,
		sampler: {
			type: string,
			param: number
		}
	}
	reporter: {
		logSpans: boolean,

	}
}