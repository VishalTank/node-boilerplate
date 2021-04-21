const httpStatus = require('http-status');
const ApiError = require('../../utils/ApiError');

const paginate = (schema) => {
    let sort = '';

    // eslint-disable-next-line no-param-reassign
    schema.statics.paginate = async function (filter, options) {
        if (options.sortBy) {
            const sortingCriteria = [];

            options.sortBy.split(',').forEach((sortByOption) => {
                const [key, order] = sortByOption.split(':');
                sortingCriteria.push((order === 'desc' ? '-' : '') + key);
            });

            sort = sortingCriteria.join(' ');
        } else {
            sort = '';
        }

        const limit = options.limit && parseInt(options.limit, 10) > 0 ? parseInt(options.limit, 10) : 10;
        const page = options.page && parseInt(options.page, 10) > 0 ? parseInt(options.page, 10) : 1;
        const skip = (page - 1) * limit;

        const countPromise = this.countDocuments(filter).exec();
        let documentsPromise = this.find(filter).sort(sort).skip(skip).limit(limit);

        documentsPromise = documentsPromise.exec();

        return Promise.all([countPromise, documentsPromise])
            .then((values) => {
                const [totalResults, results] = values;
                const totalPages = Math.ceil(totalResults / limit);
                const result = {
                    results,
                    page,
                    limit,
                    totalPages,
                    totalResults,
                };

                return Promise.resolve(result);
            })
            .catch((err) => new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err));
    };
};

module.exports = paginate;
