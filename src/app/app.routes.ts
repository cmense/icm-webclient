import { Routes, RouterModule, CanActivate, Router } from '@angular/router';
import { HomeComponent, ProfileComponent, NoContentComponent, LoginComponent } from './pages';
import { Injectable } from '@angular/core';
import { AuthService } from './services';
import { DataResolver } from './app.resolver';
import { AuthGuard } from './app.authGuard';

export const ROUTES: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent },
  //{ path: 'unauthorized', component: UnauthorizedComponent }
  /*{
    path: 'detail', loadChildren: () => System.import('./+detail').then((comp: any) => {
      return comp.default;
    })
    ,
  },*/
  { path: '**', redirectTo: 'login' },
];
