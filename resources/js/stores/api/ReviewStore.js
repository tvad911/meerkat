import ApiReviewActionTypes from '../../constants/api/ReviewActionTypes';
import ApiReviewDispatcher from "../../dispatcher/api/ReviewDispatcher.js";
import { EventEmitter } from 'events';

class ReviewStore extends EventEmitter {
	constructor() {
		super();
		ApiReviewDispatcher.register(this.handleActions.bind(this));
	}

	doReview(data) {
		fetch(process.env.MIX_APP_URL + '/api/do-review', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(data)
		})
		.then((res) => {
			switch (res.status) {
				case 201:
					this.emit("do_review.201");
					break;
				default:
					this.emit("do_review.error");
					break;
			}
		});
	}

	fetchAll() {
		fetch(process.env.MIX_APP_URL + '/api/reviews', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		})
		.then((res) => {
			if (res.status !== 200) throw new Error(res.status);
			else return res.json();
		})
		.then((data) => {
			this.emit("fetch_all.200", data);
		})
		.catch((error) => {
			this.emit("fetch_all.error");
		});
	}

	handleActions(action) {
		switch (action.type) {
			case ApiReviewActionTypes.DO_REVIEW:
				this.doReview();
				break;
			case ApiReviewActionTypes.FETCH_ALL:
				this.fetchAll();
				break;
			default:
        // do nothing
		}
	}
}

export default new ReviewStore();
