import { CommonModule } from '@angular/common';
import {
    Component,
    ContentChild,
    ContentChildren,
    ElementRef,
    HostBinding,
    HostListener,
    Input,
    NgModule,
    QueryList,
    Inject,
    Optional,
    OnInit,
} from '@angular/core';
import { IgxHintDirective } from '../directives/hint/hint.directive';
import {
    IgxInputDirective,
    IgxInputState,
} from '../directives/input/input.directive';
import { IgxLabelDirective } from '../directives/label/label.directive';
import { IgxPrefixModule } from '../directives/prefix/prefix.directive';
import { IgxSuffixModule } from '../directives/suffix/suffix.directive';
import {
    DisplayDensity,
    IDisplayDensityOptions,
    DisplayDensityToken,
    DisplayDensityBase,
} from '../core/displayDensity';
import { IgxInputGroupBase } from './input-group.common';
import { DeprecateProperty } from '../core/deprecateDecorators';

let NEXT_ID = 0;

enum IgxInputGroupEnum {
    line,
    box,
    border,
    search,
}

enum IgxInputGroupThemeEnum {
    'material',
    'fluent',
    'bootstrap',
    'indigo-design',
}

/**
 * Determines the Input Group type.
 */
export type IgxInputGroupType = keyof typeof IgxInputGroupEnum;

/**
 * Determines the Input Group theme.
 */
export type IgxInputGroupTheme = keyof typeof IgxInputGroupThemeEnum;

@Component({
    selector: 'igx-input-group',
    templateUrl: 'input-group.component.html',
    providers: [
        { provide: IgxInputGroupBase, useExisting: IgxInputGroupComponent },
    ],
})
export class IgxInputGroupComponent extends DisplayDensityBase
    implements IgxInputGroupBase, OnInit {
    private _type: IgxInputGroupType = 'line';
    private _filled = false;
    private _variant: IgxInputGroupTheme = 'material';

    /**
     * An @Input property that sets the value of `id` attribute. If not provided it will be automatically generated.
     * ```html
     * <igx-input-group [id]="'igx-input-group-55'"></igx-input-group>
     * ```
     */
    @HostBinding('attr.id')
    @Input()
    public id = `igx-input-group-${NEXT_ID++}`;

    /**
     * Property that enables/disables the autogenerated class of the `IgxInputGroupComponent`.
     * By default applied the class is applied.
     * ```typescript
     *  @ViewChild("MyInputGroup")
     *  public inputGroup: IgxInputGroupComponent;
     *  ngAfterViewInit(){
     *  this.inputGroup.defaultClass = false;
     * ```
     * }
     */
    @HostBinding('class.igx-input-group')
    public defaultClass = true;

    /** @hidden */
    @HostBinding('class.igx-input-group--placeholder')
    public hasPlaceholder = false;

    /** @hidden */
    @HostBinding('class.igx-input-group--required')
    public isRequired = false;

    /** @hidden */
    @HostBinding('class.igx-input-group--focused')
    public isFocused = false;

    /**
     * An @Input property that disables the `IgxInputGroupComponent`.
     * ```html
     * <igx-input-group [disabled]="'true'"></igx-input-group>
     * ```
     */
    @HostBinding('class.igx-input-group--disabled')
    @Input()
    public disabled = false;

    /**
     * Prevents automatically focusing the input when clicking on other elements in the input group (e.g. prefix or suffix).
     * @remarks Automatic focus causes software keyboard to show on mobile devices.
     *
     * @example
     * ```html
     * <igx-input-group [suppressInputAutofocus]="true"></igx-input-group>
     * ```
     */
    @Input()
    public suppressInputAutofocus = false;

    /** @hidden */
    @HostBinding('class.igx-input-group--valid')
    public get validClass(): boolean {
        return this.input.valid === IgxInputState.VALID;
    }

    /** @hidden */
    @HostBinding('class.igx-input-group--invalid')
    public get invalidClass(): boolean {
        return this.input.valid === IgxInputState.INVALID;
    }

    /** @hidden */
    @HostBinding('class.igx-input-group--warning')
    public hasWarning = false;

    /** @hidden */
    @HostBinding('class.igx-input-group--filled')
    public get isFilled() {
        return this._filled || (this.input && this.input.value);
    }

    /** @hidden */
    @HostBinding('class.igx-input-group--cosy')
    public get isDisplayDensityCosy() {
        return this.displayDensity === DisplayDensity.cosy;
    }

    /** @hidden */
    @HostBinding('class.igx-input-group--comfortable')
    public get isDisplayDensityComfortable() {
        return this.displayDensity === DisplayDensity.comfortable;
    }

    /** @hidden */
    @HostBinding('class.igx-input-group--compact')
    public get isDisplayDensityCompact() {
        return this.displayDensity === DisplayDensity.compact;
    }

    /** @hidden */
    @ContentChildren(IgxHintDirective, { read: IgxHintDirective })
    protected hints: QueryList<IgxHintDirective>;

    /** @hidden */
    @ContentChild(IgxInputDirective, { read: IgxInputDirective, static: true })
    protected input: IgxInputDirective;

    /** @hidden */
    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent) {
        if (
            !this.isFocused &&
            event.target !== this.input.nativeElement &&
            !this.suppressInputAutofocus
        ) {
            this.input.focus();
        }
    }

    /** @hidden */
    @HostListener('pointerdown', ['$event'])
    public onPointerDown(event: PointerEvent) {
        if (this.isFocused && event.target !== this.input.nativeElement) {
            event.preventDefault();
        }
    }

    /**
     * An @Input property that sets how the input will be styled.
     * Allowed values of type IgxInputGroupType.
     * ```html
     * <igx-input-group [type]="'search'">
     * ```
     */
    @Input('type')
    public set type(value: IgxInputGroupType) {
        this._type = value;
    }

    /**
     * Returns the type of the `IgxInputGroupComponent`. How the input is styled.
     * The default is `line`.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputType = this.inputGroup.type;
     * }
     * ```
     */
    public get type() {
        return this._type;
    }

    /**
     * Returns the theme of the `IgxInputGroupComponent`.
     * The default is `material`.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputType = this.inputGroup.theme;
     * }
     * ```
     */
    public get theme(): IgxInputGroupTheme {
        return this._variant;
    }

    /**
     * @hidden
     * @deprecated Use 'suppressInputAutofocus' instead.
     */
    @DeprecateProperty(`Deprecated. Use 'suppressInputAutofocus' instead.`)
    @Input()
    public get supressInputAutofocus(): boolean {
        return this.suppressInputAutofocus;
    }

    /**
     * @hidden
     * @deprecated Use 'suppressInputAutofocus' instead.
     */
    public set supressInputAutofocus(value: boolean) {
        this.suppressInputAutofocus = value;
    }

    constructor(
        public element: ElementRef<HTMLElement>,
        @Optional()
        @Inject(DisplayDensityToken)
        _displayDensityOptions: IDisplayDensityOptions
    ) {
        super(_displayDensityOptions);
    }

    ngOnInit() {
        const variant = window
            .getComputedStyle(this.element.nativeElement)
            .getPropertyValue('--igx-input-group-variant')
            .trim();
        this._variant = variant as IgxInputGroupTheme;
    }

    /**
     * Returns whether the `IgxInputGroupComponent` has hints.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputHints = this.inputGroup.hasHints;
     * }
     * ```
     */
    public get hasHints() {
        return this.hints.length > 0;
    }

    /**
     * Returns whether the `IgxInputGroupComponent` has border.
     * ```typescript
     * @ViewChild("MyInputGroup")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let inputBorder = this.inputGroup.hasBorder;
     * }
     * ```
     */
    public get hasBorder() {
        return (
            (this._type === 'line' || this._type === 'box') &&
            this._variant === 'material'
        );
    }

    /**
     * Returns whether the `IgxInputGroupComponent` type is line.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeLine = this.inputGroup.isTypeLine;
     * }
     * ```
     */
    public get isTypeLine(): boolean {
        return this._type === 'line' && this._variant === 'material';
    }

    /**
     * Returns whether the `IgxInputGroupComponent` type is box.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBox = this.inputGroup.isTypeBox;
     * }
     * ```
     */
    @HostBinding('class.igx-input-group--box')
    public get isTypeBox() {
        return this._type === 'box' && this._variant === 'material';
    }

    /**
     * Returns whether the `IgxInputGroupComponent` type is border.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBorder = this.inputGroup.isTypeBorder;
     * }
     * ```
     */
    @HostBinding('class.igx-input-group--border')
    public get isTypeBorder() {
        return this._type === 'border' && this._variant === 'material';
    }

    /**
     * Returns true if the `IgxInputGroupComponent` theme is Fluent.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeFluent = this.inputGroup.isTypeFluent;
     * }
     * ```
     */
    @HostBinding('class.igx-input-group--fluent')
    public get isTypeFluent() {
        return this._variant === 'fluent';
    }

    /**
     * Returns true if the `IgxInputGroupComponent` theme is Bootstrap.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeBootstrap = this.inputGroup.isTypeBootstrap;
     * }
     * ```
     */
    @HostBinding('class.igx-input-group--bootstrap')
    public get isTypeBootstrap() {
        return this._variant === 'bootstrap';
    }

    /**
     * Returns true if the `IgxInputGroupComponent` theme is Indigo.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeIndigo = this.inputGroup.isTypeIndigo;
     * }
     * ```
     */
    @HostBinding('class.igx-input-group--indigo')
    public get isTypeIndigo() {
        return this._variant === 'indigo-design';
    }

    /**
     * Returns whether the `IgxInputGroupComponent` type is search.
     * ```typescript
     * @ViewChild("MyInputGroup1")
     * public inputGroup: IgxInputGroupComponent;
     * ngAfterViewInit(){
     *    let isTypeSearch = this.inputGroup.isTypeSearch;
     * }
     * ```
     */
    @HostBinding('class.igx-input-group--search')
    public get isTypeSearch() {
        return this._type === 'search';
    }

    /** @hidden */
    public get filled() {
        return this._filled;
    }

    /** @hidden */
    public set filled(val) {
        this._filled = val;
    }
}

/** @hidden */
@NgModule({
    declarations: [
        IgxInputGroupComponent,
        IgxHintDirective,
        IgxInputDirective,
        IgxLabelDirective,
    ],
    exports: [
        IgxInputGroupComponent,
        IgxHintDirective,
        IgxInputDirective,
        IgxLabelDirective,
        IgxPrefixModule,
        IgxSuffixModule,
    ],
    imports: [CommonModule, IgxPrefixModule, IgxSuffixModule],
})
export class IgxInputGroupModule {}
