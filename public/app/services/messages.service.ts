import { Injectable } from '@angular/core';
import { Message } from 'primeng/primeng';

@Injectable()
export class Messages {
    public msgs: Message[] = [];
    public success(msg: string, summary?: string) {
        this.msgs.push({ severity: 'success', detail: msg, summary: summary });
    }
    public info(msg: string, summary?: string) {
        this.msgs.push({ severity: 'info', detail: msg, summary: summary });
    }
    public warn(msg: string, summary?: string) {
        this.msgs.push({ severity: 'warn', detail: msg, summary: summary });
    }
    public error(msg: string, summary?: string) {
        this.msgs.push({ severity: 'error', detail: msg, summary: summary });
    }
}