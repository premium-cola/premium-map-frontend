import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { FeedbackRoutingModule } from './feedback-routing.module';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [FeedbackComponent],
  imports: [
    CommonModule,
    FormsModule,
    FeedbackRoutingModule
  ]
})
export class FeedbackModule { }
