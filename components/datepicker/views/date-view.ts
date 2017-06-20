import { Component, HostBinding, EventEmitter, Output, Input } from "@angular/core";
import { SuiLocalizationService } from "../../util/services/localization.service";
import { CalendarDateItem } from "../calendar-item";
import { CalendarView } from "./calendar-view";
import { Util } from "../../util/util";

@Component({
    selector: "sui-calendar-date-view",
    template: `
<table class="ui celled center aligned unstackable table seven column day">
<thead>
    <tr>
        <th colspan="7">
            <span class="link" (click)="zoomOut()">{{ month }} {{ year }}</span>
            <span class="prev link" (click)="prevDateRange()">
                <i class="chevron left icon"></i>
            </span>
            <span class="next link" (click)="nextDateRange()">
                <i class="chevron right icon"></i>
            </span>
        </th>
    </tr>
    <tr>
        <th *ngFor="let day of days">{{ day }}</th>
    </tr>
</thead>
<tbody>
    <tr *ngFor="let group of renderedItems">
        <td class="link"
            *ngFor="let item of group"
            [calendarItem]="item"
            (click)="setDate(item)">{{ item.humanReadable }}
        </td>
    </tr>
</tbody>
</table>
`,
    styles: [`
:host {
    user-select: none;
}
`]
})
export class SuiCalendarDateView extends CalendarView {
    public get days():string[] {
        const days = this.localizationService.getValues().datepicker.weekdaysShort;
        return days.map((d, i) => days[(i + this.firstDayOfWeek) % days.length]);
    }

    public get year():number {
        return this.renderedDate.getFullYear();
    }

    public get month():string {
        return this.localizationService
            .getValues().datepicker.months[this.renderedDate.getMonth()];
    }

    @Input()
    public firstDayOfWeek:number;

    constructor(public localizationService:SuiLocalizationService) {
        super();

        this.firstDayOfWeek = this.localizationService
            .getValues().datepicker.firstDayOfWeek;

        this.renderItems();
    }

    public renderItems():void {
        const monthStart = Util.Date.startOfMonth(Util.Date.clone(this.renderedDate));
        const month = monthStart.getMonth();
        monthStart.setDate((1 - monthStart.getDay() + this.firstDayOfWeek - 7) % 7);

        const dates:CalendarDateItem[] = [];

        Util.Array.range(6 * 7).forEach(i => {
            const date = Util.Date.clone(monthStart);
            date.setDate(date.getDate() + i);

            dates.push(
                new CalendarDateItem(
                    date,
                    date.getDate().toString(),
                    date.getMonth() !== month,
                    !!this._selectedDate && Util.Date.datesEqual(date, this._selectedDate)));
        });

        this.renderedItems = Util.Array.group(dates, 7);
    }

    public nextDateRange():void {
        this.renderedDate.setMonth(this.renderedDate.getMonth() + 1);
        this.renderItems();
    }

    public prevDateRange():void {
        this.renderedDate.setMonth(this.renderedDate.getMonth() - 1);
        this.renderItems();
    }
}
