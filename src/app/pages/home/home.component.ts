import { Component, inject } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ProductService } from '../../services/product.service';
import { SearchTextfieldComponent } from '../../components/search-textfield/search-textfield.component';
import { ProductCardComponent } from '../../components/product-card/product-card.component';
import { IProductViewModel } from '../../shared/interfaces';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [HttpClientModule, SearchTextfieldComponent, ProductCardComponent, MatButtonModule],
  providers: [ProductService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  productService = inject(ProductService);
  productList: IProductViewModel[] = [];

  currentPage = 1;
  recordCountPerPage = 10;
  lastIndex = this.currentPage * this.recordCountPerPage;
  firstIndex = this.lastIndex - this.recordCountPerPage;
  recordList = this.productList.slice(this.firstIndex, this.lastIndex);
  pageCount = Math.ceil(this.productList.length / this.recordCountPerPage);
  numberList = [...Array(this.pageCount + 1).keys()].slice(1);

  updateInputs() {
    this.lastIndex = this.currentPage * this.recordCountPerPage;
    this.firstIndex = this.lastIndex - this.recordCountPerPage;
    this.recordList = this.productList.slice(this.firstIndex, this.lastIndex);
    this.pageCount = Math.ceil(this.productList.length / this.recordCountPerPage);
    this.numberList = [...Array(this.pageCount + 1).keys()].slice(1);
  }

  nextPage() {
    if (this.currentPage !== this.pageCount) {
      this.currentPage = this.currentPage + 1;
      this.updateInputs();
    }
  }

  previousPage() {
    if (this.currentPage !== 1) {
      this.currentPage = this.currentPage - 1;
      this.updateInputs();
    }
  }

  changeCurrentPage(id: number) {
    this.currentPage = id;
    this.updateInputs();
  }

  handleSearchTriggered(keyword: string) {
    this.productService.getProductList(false, keyword).subscribe(
      data => {
        this.productList = data;
        this.updateInputs();
      },
      errorObject => {
        console.log(errorObject.error);
      });
  }

  handleChangeCurrentPage(item: number) {
    this.changeCurrentPage(item);
  }
  
  handlePreviousClicked() {
    this.previousPage();
  }

  handleNextClicked() {
    this.nextPage();
  }
}
