import $ from 'jquery'

export default class {
	// 土台となるclassを準備
	// 最初に実行される処理であるconstructorをセット
	constructor() {
		if(!$('.p-carousel').length) return;
		this.current = 1;
		this.num = $('.p-carousel__box li').length;
	}

	//methodを用意
	init(){
		this.next();
		this.prev();
	}
	next() {
		$('.next').on('click', () => {
			console.log(this.current,this.num);
			$('.p-carousel__box li').removeClass('is-active');
			if(this.current === this.num) {
				$('.p-carousel__box li').eq(0).addClass('is-active');
				this.current = 1;
			} else {
				this.current++;
				$('.p-carousel__box li').eq(this.current - 1).addClass('is-active');
			}
		});
	}
	prev() {
		$('.prev').on('click', () => {
			$('.p-carousel__box li').removeClass('is-active');
			if(this.current === 1) {
				$('.p-carousel__box li').eq(this.num - 1).addClass('is-active');
				this.current = this.num;
			} else {
				this.current--;
				$('.p-carousel__box li').eq(this.current - 1).addClass('is-active');
			}
		});
	}
}