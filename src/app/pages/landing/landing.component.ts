import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from '../../services/app.layout.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html'
})
export class LandingComponent {

    constructor(public router: Router) { }
}
