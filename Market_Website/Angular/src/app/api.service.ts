import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public orderId: number = 0;
  public products = new BehaviorSubject<any>([]);
  public cart = new BehaviorSubject<any>([]);
  public srch = <any>([])
  public arr1 = <any>([]);
  public arr = <any>([]);
  public UserID = <any>("");
  public globalURL = 'http://localhost:5000';
  public sum: number = 0;
  public quantity: number = 1;
  public flag1: any = 0;
  public LastDate = <any>([])
  // ========================================constructor==============================================================
  constructor(public http: HttpClient) {
    this.products; <object>([]); this.getInfoFromServer("getProducts");//=======================bring products for Cards
    this.orderId = localStorage.OrderId;
    this.start()
  }
  // ===================================================================================================================
  async start() {
    let Uid = JSON.parse(localStorage.UserId)
    let NewOid = await this.NewOid(Uid) //=======================Update order id
    localStorage.OrderId = JSON.stringify(NewOid[0].order_id)
  }
  //======================================================= Brings all products =========================================
  getInfoFromServer(url) {
    return this.http.get(this.globalURL + '/' + url).toPromise().then(result => {
      if (url == "getProducts") {
        this.products.next(result);
      }
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //======================================================= Brings all orders =========================================
  getInfoFromServer1(url) {
    return this.http.get(this.globalURL + '/' + url).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================Check if exist Order id =========================================
  CheckOpenOrder(uId) {
    console.log("Uid CheckOpenOrder =", uId);
    let ob = {
      uid: uId
    }
    return this.http.post(this.globalURL + '/checkOpenOrder', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================set new order =========================================
  setOrder(uId) {
    let ob = {
      uid: uId
    }
    return this.http.post(this.globalURL + '/setOrder', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ===========================================Update order id======================================================
  NewOid(uid) {
    let ob = {
      uid: uid,
    }
    // console.log("NewOid = ", ob)
    return this.http.post(this.globalURL + '/getNewOid', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ===========================================Admin add new product================================================
  AddNewProduct(obj) {
    return this.http.post(this.globalURL + '/AddNewProduct', obj).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ======================================================searchProduct=============================================
  searchProduct(Info) {
    let ob = {
      name: Info.product,
    }
    return this.http.post(this.globalURL + '/searchProduct', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ==========================================finish order and shipping=============================================
  FinishOrder(Info2) {
    let ob = {
      city: Info2.city,
      street: Info2.street,
      shipping_date: Info2.shipping_date,
      finish_date: Info2.date,
      payment: Info2.payment,
      orderId: this.orderId,
    }
    // console.log("Finish Order  = ", ob)
    return this.http.post(this.globalURL + '/FinishOrder1', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ============================================Get cart==============================================================
  GetCart(Uid, Oid) {
    let ob = {
      orderId: Oid,
      uid: Uid,
    }
    return this.http.post(this.globalURL + '/FillCart', ob).toPromise().then(result => {
      this.cart.next(result);
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ===========================================like get cart==========================================================
  fillcart(Oid) {
    let ob = {
      orderId: Oid,
    }
    return this.http.post(this.globalURL + '/FillCart', ob).toPromise().then(result => {
      this.cart.next(result);
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //===================================================admin delete product===============================================
  deleteProduct(id) {
    let ob = {
      productId: id
    }
    console.log("deleteProduct", ob)
    return this.http.post(this.globalURL + '/deleteProduct', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });

  }
  //===================================================admin Update product===============================================
  UpdateInfo(Info, productId) {
    let ob = {
      productName: Info.productName,
      productPrice: Info.productPrice,
      description: Info.Description,
      productId: productId
    }
    console.log("UpdateInfo", ob)
    return this.http.post(this.globalURL + '/UpdateProduct', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //===================================================admin Update image===============================================
  UpdateImage(Info, imageId) {
    let ob = {
      NewURL: Info.newURL,
      ImageId: imageId
    }
    // console.log("ob", ob)
    return this.http.post(this.globalURL + '/UpdateImage', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=================================================== Update cart===============================================

  makeOrder(ob) {
    let ans = this.UpdateFromCart("updateOrder", this.orderId)
    this.cart.next([]);
  }

  UpdateFromCart(url, id) {
    let ob = {
      orderId: id
    }
    // console.log("UpdateFromCart", ob)
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      console.log("addToCart1 : ", ob)
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================User add to cart =========================================
  addtoBasket(obj, quantity) {
    // console.log("product from card", obj)
    this.sum = Number(this.sum) + Number(obj.new_price * quantity);
    this.quantity = quantity;

    let ob = {
      id: obj.id,
      orderId: this.orderId,
      categoryId: obj.catagory_id,
      image: obj.image,
      imgChanged: obj.imgChanged,
      name: obj.name,
      price: obj.new_price,
      quantity: quantity,
      sum: this.sum
    }
    this.arr = this.cart.value;
    this.arr.push(ob);
    this.cart.next(this.arr);
    // console.log("this.arr : ", this.arr)
    console.log("cart : ", this.cart.value);//=====================show cart
    this.addToCart1("addProductToCart", ob)
    this.UpdateTotalPrice()//======================================Update the total price
    localStorage.cart = JSON.stringify(this.cart.value)
  }
  //======================================================= Brings all Users =========================================
  GetUsers() {
    return this.http.get(this.globalURL + '/GetUsers').toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=============================================================================================================
  addToCart1(url, ob) {
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  // ================================================================== Bring last purchase date =======================================================================================
  getLastDate(url, uid) {
    let ob = {
      uid: uid
    }
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  getLastDate1(url, uid) {
    // console.log("uid  : ", uid)
    let ob = {
      uid: uid
    }
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================check user name and password=========================================
  CheckLogin(Info) {
    console.log("Login Inputs =", Info);
    return this.http.post(this.globalURL + '/CheckLogin', Info).toPromise().then(result => {
      return (result);
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================Start Session=========================================
  StartSession(UserInfo) {
    return this.http.post(this.globalURL + '/loginSession', UserInfo, { withCredentials: true }).toPromise().then(result => {
      // console.log("result from StartSession=", result)
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================Regester 1 step=========================================
  Regester1(Info1) {
    // console.log("Info1=", Info1);
    return this.http.post(this.globalURL + '/Regester1', Info1).toPromise().then(result => {
      this.BringID(Info1)
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //===================================================================================
  BringID(Info1) {
    return this.http.post(this.globalURL + '/BringID', Info1).toPromise().then(result => {
      // console.log("result = ", result)
      this.UserID = result;
      console.log("this.UserID = ", this.UserID)
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================Regester 2 step=========================================
  Regester2(Info2) {
    let ob = {
      city: Info2.city,
      street: Info2.street,
      name: Info2.name,
      lastname: Info2.lastname,
      userid: this.UserID[0].id
    }
    // console.log("ob=", ob);
    return this.http.post(this.globalURL + '/Regester2', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================Update total price================================

  UpdateTotalPrice() {
    let ob = {
      sum: Number(this.sum),
      Oid: Number(this.orderId)
    }
    // console.log("ob from total price=", ob);
    return this.http.post(this.globalURL + '/UpdateTotalPrice', ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
  //=======================================================delete from cart====================================
  deleteFromCart(id, price, Quantity, status) {
    this.sum = this.sum - Number(price) * Quantity;
    this.UpdateTotalPrice()
    // console.log("status", status)
    if (status === "WithPId") {
      const index = this.cart.value.findIndex(item => item.productId == id);//=====find index to delete
      this.cart.value.splice(index, 1);
      this.cart.next(this.cart.value);
      console.log("this.cart after splice ", this.cart.value)
    }
    if (status === "NoPId") {
      const index = this.cart.value.findIndex(item => item.id == id);//=====find index to delete
      this.cart.value.splice(index, 1);
      this.cart.next(this.cart.value);
      console.log("this.cart after splice ", this.cart.value)
    }
    this.DeleteFromCart("deleteProductFromCart", id)
  }
  //=============== delete from DB cart
  DeleteFromCart(url, id) {
    let order_id = JSON.parse(localStorage.OrderId)
    let ob = {
      id: id,
      orderId: order_id
    }
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }

  //=======================================================delete all products from cart====================================
  deleteorder(url) {
    let order_id = JSON.parse(localStorage.OrderId)
    let ob = {
      orderId: order_id
    }
    return this.http.post(this.globalURL + '/' + url, ob).toPromise().then(result => {
      this.cart.next(this.cart.value);
      return result;
    }).catch(err => {
      return Promise.reject(err.error || 'Server error');
    });
  }
}

