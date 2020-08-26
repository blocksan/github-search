
import { EContentType } from './../../shared/interfaces/EContentType';

export const apiUtil = {
    [EContentType.user] : 'https://api.github.com/search/users',
    [EContentType.respository] : 'https://api.github.com/search/repositories'
}