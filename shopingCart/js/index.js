class UIGood {
  constructor(good) {
    this.good = good;
    this.choose = 0;
  }

  getTotalPrice() {
    return this.good.price * this.choose;
  }

  increase() {
    this.choose++;
  }

  decrease() {
    if (this.choose === 0) {
      return;
    }
    this.choose--;
  }
}

class UIData {
  constructor() {
    this.goods = goods.map((good) => new UIGood(good));
    this.deliveryPrice = 5;
    this.deliveryThreshold = 30;
  }

  getTotalPrice() {
    let sum = 0;
    sum = this.goods.reduce((acc, cur) => {
      return acc + cur.getTotalPrice();
    }, sum);
    return sum;

    console.log("sum: ", sum);
  }

  increase(index) {
    this.goods[index].increase();
  }

  decrease(index) {
    this.goods[index].decrease();
  }

  getTotalChooseNumber() {
    let sum = 0;
    sum = this.goods.reduce((acc, cur) => {
      return acc + cur.choose;
    }, sum);
    return sum;
  }

  hasGoodsInCar() {
    return this.getTotalChooseNumber() > 0;
  }
  isCrossDeliveryThreshold() {
    return this.getTotalPrice() > this.deliveryThreshold;
  }
}

class UI {
  constructor() {
    this.data = new UIData();
    this.doms = {
      goodsContainer: document.querySelector(".goods-list"),
      footerTotal: document.querySelector(".footer-car-total"),
      footerCarTip: document.querySelector(".footer-car-tip"),
      footerCarPaySpan: document.querySelector(".footer-pay span"),
      footerCarPay: document.querySelector(".footer-pay"),
      footerCarBages: document.querySelector(".footer-car-badge"),
      footerCar: document.querySelector(".footer-car"),
    };
    this.footerCarPosition = this.doms.footerCar.getBoundingClientRect();
    this.createHtml();
    this.updateFooter();
    this.initEventListener();
  }

  createHtml() {
    let html = "";
    this.data.goods.forEach(
      ({ good, choose }, index) =>
        (html += `<div class="goods-item">
    <img src="${good.pic}" alt="" class="goods-pic" />
    <div class="goods-info">
      <h2 class="goods-title">${good.title}</h2>
      <p class="goods-desc">
       ${good.desc}
      </p>
      <p class="goods-sell">
        <span>月售 ${good.sellNumber}</span>
        <span>好评率${good.favorRate}%</span>
      </p>
      <div class="goods-confirm">
        <p class="goods-price">
          <span class="goods-price-unit">￥</span>
          <span>${good.price}</span>
        </p>
        <div class="goods-btns">
          <i class="iconfont i-jianhao"  data-index=${index}></i>
          <span>${choose}</span>
          <i class="iconfont i-jiajianzujianjiahao"  data-index=${index}></i>
        </div>
      </div>
    </div>
  </div>`)
    );

    this.doms.goodsContainer.innerHTML = html;
  }

  initEventListener() {
    this.doms.footerCar.addEventListener("animationend", () => {
      this.doms.footerCar.classList.remove("animate");
    });

    this.doms.goodsContainer.addEventListener("click", (e) => {
      const target = e.target;
      const index = +target.getAttribute("data-index");
      if (target.classList.contains("i-jiajianzujianjiahao")) {
        this.increase(index);
      } else if (target.classList.contains("i-jianhao")) {
        this.decrease(index);
      }
    });
  }

  increase(index) {
    this.data.goods[index].increase();
    this.updateCard(index);
    this.updateFooter();
    this.animate(index);
  }

  decrease(index) {
    this.data.goods[index].decrease();
    this.updateCard(index);
    this.updateFooter();
  }

  updateCard(index) {
    const element = this.doms.goodsContainer.children[index];
    const text = element.querySelector(".goods-btns span");
    if (this.data.goods[index].choose > 0) {
      element.classList.add("active");
    } else {
      element.classList.remove("active");
    }
    text.innerText = this.data.goods[index].choose;
  }

  updateFooter() {
    const total = this.data.getTotalPrice();
    this.doms.footerTotal.innerText = total.toFixed(2);
    this.doms.footerCarTip.innerText = `配送费￥${this.data.deliveryPrice}`;
    this.doms.footerCarBages.innerText = this.data.getTotalChooseNumber();

    if (this.data.deliveryThreshold - total > 0) {
      this.doms.footerCarPay.classList.remove("active");
      this.doms.footerCarPaySpan.innerText = `还差￥${Math.round(
        this.data.deliveryThreshold - total
      )}元起送`;
    } else {
      this.doms.footerCarPay.classList.add("active");
    }

    const totalNumber = this.data.getTotalChooseNumber();
    this.doms.footerCarBages.innerText = this.data.getTotalChooseNumber();
    if (totalNumber > 0) {
      this.doms.footerCar.classList.add("active");
    } else {
      this.doms.footerCar.classList.remove("active");
    }
  }

  footerAnimation() {
    this.doms.footerCar.classList.add("animate");
  }

  animate(index) {
    const endPosition = {
      x: this.footerCarPosition.left + this.footerCarPosition.width / 2,
      y: this.footerCarPosition.top + 20,
    };
    const targetElement = this.doms.goodsContainer.children[
      index
    ].querySelector(".i-jiajianzujianjiahao");
    const targetElementPosition = targetElement.getBoundingClientRect();
    console.log("targetElementPosition: ", targetElementPosition);
    const startPosition = {
      x: targetElementPosition.left,
      y: targetElementPosition.top,
    };

    const addToCar = document.createElement("div");
    addToCar.classList = "add-to-car";
    const i = document.createElement("i");
    addToCar.style.transform = `translateX(${startPosition.x}px)`;
    i.classList = "iconfont i-jiajianzujianjiahao";
    i.style.transform = `translateY(${startPosition.y}px)`;
    addToCar.appendChild(i);
    document.body.appendChild(addToCar);

    // 强制渲染
    addToCar.clientWidth;

    addToCar.style.transform = `translateX(${endPosition.x}px)`;
    i.style.transform = `translateY(${endPosition.y}px)`;

    addToCar.addEventListener(
      "transitionend",
      () => {
        this.footerAnimation();
        addToCar.remove();
      },
      {
        once: true,
      }
    );
  }
}

const ui = new UI();
