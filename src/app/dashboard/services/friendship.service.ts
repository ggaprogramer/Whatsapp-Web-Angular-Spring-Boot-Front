import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { FriendShipRequest, FriendShipResponse, ProfileFormatted } from '../interfaces';
import { ConfigService } from '../../config/config-service.service';

@Injectable({
  providedIn: 'root'
})
export class FriendShipService {

    constructor(
        private readonly http: HttpClient,
        private readonly configService: ConfigService,
    ) {}

    sendRequestFriendShip(sendRequestFriendShip: FriendShipRequest): Observable<FriendShipResponse> {
      return this.http
      .post<FriendShipResponse>(this.configService.getApiUrl('/request/friendship'), sendRequestFriendShip, 
      { withCredentials: true })
    }

    cancelRequestFriendship(sendRequestFriendShip: FriendShipRequest): Observable<FriendShipResponse> {
      return this.http
      .delete<FriendShipResponse>(this.configService.getApiUrl('/request/friendship'), {
        body: sendRequestFriendShip,
        withCredentials: true
      })
    }

    rejectedRequestFriendShip(sendRequestFriendShip: FriendShipRequest): Observable<FriendShipResponse> {
      return this.http
      .post<FriendShipResponse>(this.configService.getApiUrl('/request/friendship-rejected'), sendRequestFriendShip, 
      { withCredentials: true })
    }

    approvedRequestFriendShip(sendRequestFriendShip: FriendShipRequest): Observable<FriendShipResponse> {
      return this.http
      .post<FriendShipResponse>(this.configService.getApiUrl('/request/friendship-approved'), sendRequestFriendShip, 
      { withCredentials: true })
    }

    getProfileListForFriendShip(): Observable<ProfileFormatted[]> {
        return this.http
      .get<ProfileFormatted[]>(this.configService.getApiUrl('/request/friendship/profile-list'), 
      { withCredentials: true })
    }

    getProfileListForFriendShipFilterByStatus(status: string): Observable<ProfileFormatted[]> {
        return this.http
      .get<ProfileFormatted[]>(this.configService.getApiUrl(`/request/friendship/profile-list-filter/${status}`), 
      { withCredentials: true })
    }


}
