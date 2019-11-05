// მენიუ
Ext.ns('eUni');

Ext.Ajax.timeout = 36000000;

// უტილები
var vpath = '';
function getPath(url) {
    return vpath + url;
}


var studentPortalRegisterCourseUrl = 'http://localhost/StudentsPortal/MyCourses/RegisterCourses';

(function () {
    var dom = typeof window.addEventListener == "function";
    var ie = typeof window.attachEvent == "object";
    function handle(evt) {
        if (evt.keyCode == 8 && (
             evt.explicitOriginalTarget.tagName == "BODY" ||
             evt.explicitOriginalTarget.tagName == "BUTTON" ||
             evt.explicitOriginalTarget.tagName == "DIV"
        )
        ) {
            if (dom) {
                evt.preventDefault();
            } else if (ie) {
                evt.returnValue = false;
            }
        }
    }
    if (dom) {
        window.addEventListener("keypress", handle, false);
    } else if (ie) {
        document.attachEvent("onkeydown", handle);
    }
})();

function GetScreenWidthHeight() {
    var he;
    var wi;
    if (typeof window.innerWidth != 'undefined') {
        wi = window.innerWidth;
        he = window.innerHeight;
    }
    else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        wi = document.documentElement.clientWidth;
        he = document.documentElement.clientHeight;
    }

        // older versions of IE

    else {
        wi = document.getElementsByTagName('body')[0].clientWidth;
        he = document.getElementsByTagName('body')[0].clientHeight;
    }
    return {
        Width: wi,
        Height: he
    }
}

function GetAvalibleHeight(winHeight) {
    var st = screenHeight - 150;
    if (st < winHeight) {
        return st;
    }
    return winHeight;
}

var urlParams = {};
function readUrlParams() {
    var e,
        a = /\+/g,  // Regex for replacing addition symbol with a space
        r = /([^&=]+)=?([^&]*)/g,
        d = function (s) { return decodeURIComponent(s.replace(a, " ")); },
        q = window.location.search.substring(1);

    while (e = r.exec(q))
        urlParams[d(e[1]).toLowerCase()] = d(e[2]);
};

function comboFullClear(cmd, isResetbaseParams) {
    if (cmd == undefined || cmd == null) return;
    cmd.clearValue();
    cmd.store.removeAll();
    cmd.lastQuery = null;
    if (isResetbaseParams)
        cmd.store.baseParams = {};

}
function GetStoreRecord(storeContainer, propName, propValue) {
    if (storeContainer == null || storeContainer.store == null) return null;
    var store = storeContainer.store;
    for (var i = 0; i < store.data.items.length; i++) {
        var item = store.data.items[i];
        if (item.data[propName].toString() == propValue.toString())
            return item.data;
    }
    return null;
}
function setbaseParam(cmd, param, value, isReset) {
    if (cmd == undefined || cmd == null) return;

    var reset = ValueIsEmpty(isReset) ? true : isReset;
    if (reset) comboFullClear(cmd);

    cmd.store.setBaseParam(param, value);
}
function getComboValue(cmd) {
    if (cmd == undefined || cmd == null) return;
    var val = cmd.getValue()
    if (ValueIsEmpty(cmd.getRawValue())) val = null;
    return val;
}
function getFieldValues(combo, nameIn, nameOut, isRawVal) {
    try {
        var r = combo.getStore().find(nameIn, isRawVal == true ? combo.getRawValue() : combo.getValue());
        if (r == -1) { return null }
        return combo.getStore().getAt(r).get(nameOut);
    }
    catch (err) {
        return null;
    }
}

function gridSetReadOnly(id, isReadOnly) {
    var grid = Ext.getCmp(id);
    Ext.each(grid.getColumnModel().columns, function (col, index) {
        grid.getColumnModel().setEditable(index, !isReadOnly);
    });
    if (isReadOnly) grid.getSelectionModel().lock();
    if (isReadOnly) grid.getSelectionModel().unlock()
}

Ext.util.Format.comboRenderer = function (combo) {
    return function (value) {
        var record = combo.findRecord(combo.valueField, value);

        return record ? record.get(combo.displayField) : value;
    };
};

function x_frmpnl_submit_fail(form, action) {
    switch (action.failureType) {
        case Ext.form.Action.CLIENT_INVALID:
            Ext.Msg.alert('Failure', 'Form fields may not be submitted with invalid values');
            break;
        case Ext.form.Action.CONNECT_FAILURE:
            Ext.Msg.alert('Failure', 'Ajax communication failed');
            break;
        case Ext.form.Action.SERVER_INVALID:
            Ext.Msg.alert('Failure', action.result.msg);
    }
};
function cloneObject(obj) {
    if (null == obj || "object" != typeof obj) return obj;
    var copy = obj.constructor();
    for (var attr in obj) {
        if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
    }
    return copy;
}
var createAjaxAwait = function (paramObj) {
    //onStart
    //onEnd
    //showWait
    var ajaxCounter = 0;
    var waitBoxAjax = null;
    this.StartAjax = function () {
        ajaxCounter++;
        if (ajaxCounter == 1) {
            if (ValueNotEmpty(paramObj.showWait)) waitBoxAjax = Ext.MessageBox.wait('სტატუსი', 'დაელოდეთ...');
            if (ValueNotEmpty(paramObj.onStart)) paramObj.onStart();
        }
    }
    this.EndAjax = function () {
        ajaxCounter--;
        if (ajaxCounter == 0) {
            if (ValueNotEmpty(waitBoxAjax)) waitBoxAjax.hide();
            if (ValueNotEmpty(paramObj.onEnd)) paramObj.onEnd();
        }
    }
    return this;
}

function isOdd(num) { return num % 2; }

localization = {
    dateFormat: 'd.m.Y',
    timeFormat: 'H:i',
    dateSeparator: '.',
    dateTimeFormat: 'd.m.Y H:i'
};


//ფუნქცია რომელიც აფორმატებს მოსულ თარიღს
function dateRenderer(val) {
    return val == null ? '' : val.format(localization.dateFormat);
}

function getRowNumbererColumn(colWidth) {
    return {
        header: '', width: colWidth, renderer: function (v, p, record, rowIndex) {
            if (this.rowspan) { p.cellAttr = 'rowspan="' + this.rowspan + '"'; }
            var st = record.store;
            if (st.lastOptions != null && st.lastOptions.params && st.lastOptions.params.Start != undefined && st.lastOptions.params.Limit != undefined) {
                var page = Math.floor(st.lastOptions.params.Start / st.lastOptions.params.Limit);
                var limit = st.lastOptions.params.Limit;
                return limit * page + rowIndex + 1;
            } else { return rowIndex + 1; }
        }
    };
}

function ValueNotEmpty(value) {
    return (
        value != null &&
            value != undefined &&
                value !== '' &&
                    value !== "" ||
                            (value === true || value === false)
    );
}
function ValueIsEmpty(value) {
    return !ValueNotEmpty(value);
}
function refreshStore(storeContainer) {
    var st = storeContainer.store.data.items;
    storeContainer.store.removeAll();
    for (var i = 0; i < st.length; i++) {
        setStoreRecord(storeContainer, st[i].data);
    }
}
function setStoreRecords(storeContainer, objects) {
    for (var i = 0; i < objects.length; i++) {
        setStoreRecord(storeContainer, objects[i]);
    }
}
function insertDataStore(store, object) {
    store.insert(
         store.data.items.length,
          new store.recordType(
              object, store.data.items.length
          )
      );
}
function setStoreRecord(storeContainer, object) {
    storeContainer.store.insert(
        storeContainer.store.data.items.length,
        new storeContainer.store.recordType(
            object, storeContainer.store.data.items.length
        )
    );
}

Ext.grid.CheckboxSelectionModel.override({
    hideCheckbox: function () {
        var cm = this.grid.getColumnModel();
        var idx = cm.getIndexById(this.id);
        cm.setHidden(idx, true);
    },
    showCheckbox: function () {
        var cm = this.grid.getColumnModel();
        var idx = cm.getIndexById(this.id);
        cm.setHidden(idx, false);
    }
});


eUni.CustomCombo = Ext.extend(Ext.Panel, {
    border: false,
    width: 300,
    height: 200,
    comboStore: null,
    valueField: null,
    txtField: null,
    displayField: null,
    initComponent: function () {
        var config = {
            items: [{
                xtype: 'compositefield',
                width: 300,
                items: [{
                    xtype: 'combo',
                    width: 120,
                    tpl: '<tpl for="."><div class="x-combo-list-item">{' + this.displayField + '} - {' + this.txtField + '}</div></tpl>',
                    store: this.comboStore,
                    mode: 'remote',
                    pageSize: 5,
                    resizable: true,
                    triggerAction: 'all',
                    minListWidth: 240,
                    valueField: this.valueField,
                    displayField: this.displayField,
                    txtField: this.txtField,
                    hiddenName: this.valueField,
                    minChars: 0,
                    listeners: {
                        select: function (el, rec, index) {
                            Ext.getCmp('cf' + el.txtField).setValue(rec.get(el.txtField));

                        }
                    }
                }, {
                    xtype: 'textfield',
                    width: 160,
                    id: 'cf' + this.txtField
                }]
            }]
        };
        Ext.apply(this, Ext.apply(this.initialConfig, config));
        eUni.CustomCombo.superclass.initComponent.apply(this, arguments);
    },
    onRender: function () {
        eUni.CustomCombo.superclass.onRender.apply(this, arguments);
    }
});

Ext.reg('customcombo', eUni.CustomCombo);

eUni.ExportButton = Ext.extend(Ext.Button, {
    text: 'ექსპორტი',
    iconCls: 'icon-excel',
    submit: function (url, jsonString) {
        if (Ext.get('downloaderFrame') != null)
            Ext.get('downloaderFrame').remove();
        var body = Ext.getBody();
        var frame = body.createChild({
            tag: 'iframe',
            cls: 'x-hidden',
            id: 'downloaderFrame',
            name: 'iframe'
        });
        var f = body.createChild({
            tag: 'form',
            cls: 'x-hidden',
            id: 'downloaderForm',
            method: 'POST',
            action: url,
            target: 'iframe'
        });
        var inputpara = f.createChild({
            tag: 'input',
            type: 'hidden',
            name: 'filter',
            value: escape(Ext.util.JSON.encode(jsonString))
        });
        f.dom.submit();
    },
    initComponent: function () {
        eUni.ExportButton.superclass.initComponent.apply(this, arguments);
    }
});
Ext.reg('exportbutton', eUni.ExportButton);

//if (!Ext.grid.GridView.prototype.templates) {
//   Ext.grid.GridView.prototype.templates = {};
//}
//Ext.grid.GridView.prototype.templates.cell = new Ext.Template(
//   '<td class="x-grid3-col x-grid3-cell x-grid3-td-{id} x-selectable {css} style="{style}" tabIndex="0" {cellAttr}> <div class="x-grid3-cell-inner x-grid3-col-{id}" {attr}>{value}</div></td>'
//);

var submitLogonForm = function () {
    var theForm = logonForm.getForm();

    //var ReturnUrl = Ext.isEmpty(urlParams['returnurl']) ? getPath('/') : urlParams['returnurl'];
    var RememberMe = logonForm.rememberMeCkb.getValue();
    var UserName = logonForm.userName.getValue();
    var Password = logonForm.password.getValue();
    var smsCode = logonForm.smsCode.getValue();
    if (theForm.isValid()) {
        AjaxRequestV2("Security/Authenticate", {
            'RememberMe': RememberMe,
            'UserName': UserName,
            'Password': Password,
            'smsCode': smsCode,
        }, "დაელოდეთ", function (data) {

            if (ValueNotEmpty(data.wvc) && data.wvc == true) {
                var kataWin = Ext.getCmp("kataWin");
                if (kataWin != undefined) {
                    kataWin.hide();
                } else {
                    document.location = getPath('/');
                }
                return;
            }

            if (!logonForm.userName.hidden) {
                logonForm.userName.hide();
                logonForm.password.hide();
                logonForm.rememberMeCkb.hide();
                logonForm.autolabel.show();
                logonForm.smsCode.show();
                logonForm.smsCode.enable();
                logonForm.CodeGeneration.show();
            } else {
                // logonForm.smsCode.setValue();             
                var kataWin = Ext.getCmp("kataWin");
                if (kataWin != undefined) {
                    kataWin.hide();
                } else {
                    document.location = getPath('/');
                }
            }
        });


        //  getPath('/Security/Authenticate'),

        //theForm.submit({
        //    waitMsg: 'გთხოვთ დაელოდოთ...',
        //    waitTitle: 'სტატუსი',
        //    params: {
        //        returnurl: Ext.isEmpty(urlParams['returnurl']) ? getPath('/') : urlParams['returnurl'],
        //        rememberme: logonForm.rememberMeCkb.getValue()
        //    },
        //    success: function (form, action) {

        //        //Ext.Ajax.request({
        //        //    url: getPath('/Security/preAuthenticate'),
        //        //    method: 'POST',
        //        //    params: {
        //        //        ReturnUrl: ReturnUrl,
        //        //        RememberMe: RememberMe,
        //        //        UserName: UserName,
        //        //        Password: Password
        //        //    },
        //        //    success: function (subForm, subAction) {
        //        //        document.location = Ext.util.JSON.decode(subForm.responseText).data;
        //        //    },
        //        //    failure: function (result, request) {
        //        //    }
        //        //});

        //    },

        //    failure: function (form, action) {
        //        var msg = 'სერვერთან დაკავშირებისას დაფიქსირდა შეცდომა';

        //        if (action.result.msg != '')
        //            msg = action.result.msg;
        //        Ext.Msg.alert('შეცდომა', msg);
        //    }
        //});
    }
};
var windowCallFunction = function (formItem) {
    var userWindow = new Ext.Window({
        border: false,
        autoShow: true,
        resizable: false,
        modal: true,
        items: [formItem]
    });
    userWindow.on('beforerender', isHidden);
    userWindow.on('cancel', function (scope) {
        this.close();
    });
    userWindow.on('save', function (scope) {
        this.close();
    });
    userWindow.show(this);
};

var logonForm = new Ext.FormPanel({
    id: 'logonForm',
    title: 'აუტენტიფიკაცია',
    //url: getPath('/Security/Authenticate'),
    iconCls: 'icon-lock',
    frame: true,
    labelAlign: 'right',
    isModalForm: false,
    layoutConfig: { padding: '5', align: 'middle' },
    defaults: { margins: '0 5 0 0' },
    width: 280,
    keys: [{ key: [Ext.EventObject.ENTER], handler: function () { submitLogonForm(); } }],
    items: [{
        items: [{
            layout: 'form',
            items: [
                new Ext.form.TextField({
                    name: 'userName',
                    ref: '../../userName',
                    inputType: 'text',
                    fieldLabel: 'მომხმარებელი',
                    allowBlank: false,
                    blankText: 'შეავსეთ მომხმარებლის სახელი!'
                }),
                new Ext.form.TextField({
                    name: 'password',
                    inputType: 'password',
                    ref: '../../password',
                    fieldLabel: 'პაროლი',
                    allowBlank: false,
                    blankText: 'შეავსეთ პაროლი!'
                }),
                new Ext.form.Label({
                    name: 'autolabel',
                    text: 'შეიყვანეთ დროებითი კოდი, რომელიც მობილურზე გამოგეგზავნათ',
                    inputType: 'autolabel',
                    ref: '../../autolabel',
                    hidden: true,
                }),
                new Ext.form.TextField({
                    name: 'smsCode',
                    inputType: 'smsCode',
                    ref: '../../smsCode',
                    fieldLabel: 'კოდი',
                    allowBlank: false,
                    blankText: 'შეიყვანეთ კოდი!',
                    disabled: true,
                    hidden: true,
                }),
                new Ext.form.Checkbox({
                    ref: '../../rememberMeCkb',
                    boxLabel: 'დამიმახსოვრე',
                    fieldLabel: ''
                }), {
                    layout: 'column',
                    defaults: { bodyStyle: 'padding-right:5px' },
                    padding: 5,
                    items: [{
                        xtype: 'button',
                        hidden: true,
                        ref: '../../../CodeGeneration',
                        text: 'კოდის გენერირება',
                        iconCls: 'icon-key',
                        handler: function () {
                            AjaxRequestV2("Security/NewMobileCode", {}, "დაელოდეთ", function () { });
                        },
                        width: 150
                    }, {
                        xtype: 'button',
                        style: 'margin-left:5px;float:right',
                        id: 'loginBtn',
                        text: 'შესვლა',
                        iconCls: 'icon-key',
                        width: 100,
                        handler: submitLogonForm,
                        bubbleEvents: 'closeSuccess'
                    }]
                }]
        }]
    }]
});

Ext.apply(Ext.form.VTypes, {
    emailVal: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    emailMask: /[a-z0-9_\.\-@]/i,
    emailText: 'ელექტრონული ფოსტა უნდა იყოს "user@example.com" ფორმატში',
    email: function (v) {
        return this.emailVal.test(v);
    }
});
Ext.apply(Ext.form.VTypes, {
    password: function (val, field) {
        if (field.initialPassField) {
            var login = Ext.getCmp(field.initialPassField);
            return (val == login.getValue());
        }
        return true;
    },
    passwordText: 'პაროლი არ ემთხვევა!'
});
Ext.apply(Ext.form.VTypes, {
    mobVal: /^[5]{1}\d{8}$/,
    mobMask: /[0-9]/,
    mobText: 'დასაშვებია მხოლოდ ცხრა(9) ციფრი! ფორმატი: 5XXXXXXXX',
    mob: function (v) {
        return this.mobVal.test(v);
    }
});




Ext.override(Ext.form.Field, {
    afterRender: Ext.form.Field.prototype.afterRender.createSequence(function () {
        var qt = this.qtip;
        if (qt) {
            Ext.QuickTips.register({
                target: this,
                title: '',
                text: qt,
                enabled: true,
                showDelay: 20
            });
        }
    })
});

function inArray(needle, haystack) {
    var length = haystack.length;
    for (var i = 0; i < length; i++) {
        if (haystack[i] == needle) return true;
    }
    return false;
}

Ext.ns('Ext.ux.CustomWindow');
Ext.ux.CustomWindow = Ext.extend(Ext.Window, {
    border: false,
    autoShow: true,
    resizable: false,
    modal: true,
    initComponent: function () {
        Ext.ux.CustomWindow.superclass.initComponent.call(this);
        this.on('cancel', this.close);
        this.on('saveClose', this.close);
    }
});

Ext.reg('customwindow', Ext.ux.CustomWindow);
Ext.apply(Ext.form.ComboBox.prototype, {
    resizable: true,
    minListWidth: 200,
    minChars: 3,
    setValueLoad: function (value) {
        var combo = this;
        combo.newVal = value;
        if (combo.store.getCount() == 0) {
            combo.store.load({
                callback: function () {
                    combo.setValue(combo.newVal);
                }
            });
        }
    }
});
Ext.apply(Ext.grid.ColumnModel.prototype, {
    defaultSortable: true,
});

var EnumBillingReports = {
    InvoiceForm: '1'
};

var EnumRowClass = {
    Red: 'background-color:#FF0000;',
    Yellow: 'background-color:#FFFF00;'
};


function createNodes(tree, position) {

    var url = "";
    var params = {};
    if (tree.id == "treeSTStates") {
        url = getPath('/ReferralData/GetStudentStatuses');
    }

    if (tree.id == "treeSTstudyLevel") {
        url = getPath('/ReferralData/GetStudyLevels');
        params = { 'parentID': 2 };
    }

    if (tree.id == "treeSTStudentTypes") {
        url = getPath('/ReferralData/GetStudentTypes');
    }

    if (tree.id == "treeSSSyllabusStatuses" || tree.id.indexOf("treeSSSyllabusStatuses") > -1) {
        url = getPath('/Institutions/GetSyllabusStatuses');
        if (tree.notActive) params = { notActive: tree.notActive };
    }

    if (tree.id == "facultyCmb_AD2") {
        url = getPath('/Institutions/GetInstitutionFaculties');
    }

    if (tree.id == "treeSTGrantTypes") {
        var data = [
            { ID: 1, Name: 'სახელმწიფო' },
            { ID: 2, Name: 'სოციალური' },
            { ID: 3, Name: 'ფასდაკლება' }
        ];
        var listNode = [];
        Ext.each(data, function (item) {
            var obj = {
                id: item.ID,
                text: item.Name,
                leaf: true,
                checked: false
            };
            listNode.push(obj);
        });
        tree.setRootNode(
                new Ext.tree.AsyncTreeNode({
                    expanded: true,
                    text: '',
                    children: listNode
                })
            );
        return;
    }

    Ext.Ajax.request({
        url: url,
        method: 'POST',
        success: function (result, request) {
            var jsonData = Ext.util.JSON.decode(result.responseText);
            if (jsonData.success) {
                var listNode = [];
                Ext.each(jsonData.data, function (item) {
                    var obj = {
                        id: item.ID,
                        text: item.Name,
                        leaf: true,
                        checked: false
                    };
                    listNode.push(obj);
                });
                tree.setRootNode(
                new Ext.tree.AsyncTreeNode({
                    expanded: true,
                    text: '',
                    children: listNode
                })
            );

            } else {
                Ext.Msg.alert('სტატუსი', "მოხდა შეცდომა");
            }
        },
        failure: function (result, request) {
            Ext.Msg.alert('სტატუსი', "მოხდა შეცდომა");
        },
        jsonData: params
    });
}
function getCheckedValuesTreeCombo(treeID) {
    var ids = [];
    Ext.each(Ext.getCmp(treeID).getChecked(), function (node) {
        ids.push(node.id);
    });
    return ids;
}
function getCheckedValuesTextTreeCombo(treeID) {
    var text = "";
    Ext.each(Ext.getCmp(treeID).getChecked(), function (node) {
        if (text != "") text += ", ";
        text += node.text;
    });
    return text;
}

function comboTree(comboCfg, tree) {
    Ext.TreeCombo = Ext.extend(Ext.form.ComboBox, {
        initList: function () {
            this.list = tree;
            this.list.setZIndex = function () { };
        },
        expand: function () {
            if (!this.list.rendered) {
                this.list.render(document.body);
                this.list.setWidth(this.el.getWidth());
                this.innerList = this.list.body;
                this.list.hide();
            }
            Ext.TreeCombo.superclass.expand.apply(this, arguments);
        },
        doQuery: function () {
            this.expand();
        },
        collapseIf: function (e) {
            if (!e.within(this.wrap) && !e.within(this.list.el)) {
                this.collapse();
            }
        }       
    });
    return new Ext.TreeCombo(comboCfg);
}
function createRowNumbererColumn(colWidth) {
    return {
        header: '', width: colWidth, renderer: function (v, p, record, rowIndex) {
            if (this.rowspan) { p.cellAttr = 'rowspan="' + this.rowspan + '"'; }
            var st = record.store;
            if (st.lastOptions != null && st.lastOptions.params && st.lastOptions.params.start != undefined && st.lastOptions.params.limit != undefined) {
                var page = Math.floor(st.lastOptions.params.start / st.lastOptions.params.limit);
                var limit = st.lastOptions.params.limit;
                return limit * page + rowIndex + 1;
            } else { return rowIndex + 1; }
        },
        listeners: {
            click: function (col, The, rowIndex, e) {
                return false;
            }
        }
    };
}

function GetColumnIndex(grid, dataIndex) {
    gridColumns = grid.getColumnModel();
    for (var i = 0; i < gridColumns.length; i++) {
        if (gridColumns[i].dataIndex == dataIndex) {
            return i;
        }
    }
}


function AjaxRequestV2(url, paramsObj, waitStr, successFunk, failureFunk) {
    var waitBox = null;
    if (ValueNotEmpty(waitStr) && waitStr == "def")
        waitBox = Ext.MessageBox.wait('სტატუსი', "დაელოდეთ...");
    if (ValueNotEmpty(waitStr) && waitStr != "def")
        waitBox = Ext.MessageBox.wait('სტატუსი', waitStr);

    Ext.Ajax.request({
        url: getPath("/" + url),
        success: function (result, request) {
            var jsonData = Ext.util.JSON.decode(result.responseText);
            if (jsonData.success) {
                if (ValueNotEmpty(waitBox)) waitBox.hide();
                if (ValueNotEmpty(successFunk)) successFunk(jsonData.data);
            } else {
                if (ValueNotEmpty(waitBox)) waitBox.hide();
                if (ValueNotEmpty(failureFunk)) failureFunk();
                Ext.Msg.alert('სტატუსი', 'მოხდა შეცდომა: ' + jsonData.msg);
            }
        },
        failure: function (result, request) {
            var jsonData = Ext.util.JSON.decode(result.responseText);
            Ext.Msg.alert('სტატუსი', jsonData.success ? 'დამახსოვრებულია' : 'მოხდა შეცდომა: ' + jsonData.msg);
            if (ValueNotEmpty(waitBox)) waitBox.hide();
            if (ValueNotEmpty(failureFunk)) failureFunk();
        },
        jsonData: paramsObj
    });
}

Ext.QuickTip.override({
    dismissDelay: 10000000,
    autoWidth: true
});


var CreateAjaxAwait = function (paramObj) {
    //onStart
    //onEnd     
    //msg
    //maskCmp
    var waitBox = null;
    var ajaxCounter = 0;
    this.StartAjax = function () {
        ajaxCounter++;
        if (ajaxCounter == 1) {
            if (ValueNotEmpty(paramObj.msg)) {
                if (ValueNotEmpty(paramObj.maskCmp)) {
                    paramObj.maskCmp.el.mask(paramObj.msg);
                } else {
                    waitBox = Ext.Msg.wait('დაელოდეთ...', paramObj.msg);
                }
            }
            if (ValueNotEmpty(paramObj.onStart)) paramObj.onStart();
        }
    }
    this.EndAjax = function () {
        ajaxCounter--;
        if (ajaxCounter == 0) {
            if (ValueNotEmpty(paramObj.maskCmp)) {
                paramObj.maskCmp.el.unmask();
            }
            if (ValueNotEmpty(waitBox)) {
                waitBox.hide();
            }
            if (ValueNotEmpty(paramObj.onEnd)) paramObj.onEnd();
        }
    }
    return this;
}

function OnResize() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var w = Ext.query('.x-window');
    Ext.each(w, function (item) {
        var component = Ext.getCmp(item.id);
        if (component.width < width && (component.height < height || component.height == undefined)) {
            Ext.getCmp(item.id).center();
            return;
        } else {
            if (component.width < width && component.height > height) {
                Ext.getCmp(item.id).setPagePosition((width - component.width) / 2, 0);
                return;
            }
        }
    });
}

Ext.override(Ext.Window, {
    listeners: {
        show: function (win) {
            OnResize();
        }
    }
});


window.onresize = function () {
    OnResize();
    var width = window.innerWidth;
    var height = window.innerHeight;
    Ext.getCmp("mainMenu").setWidth(width > globalMinWidth ? width : globalMinWidth);

    var obj = GetScreenWidthHeight();
    screenWidth = obj.Width;
    screenHeight = obj.Height;
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    if (ValueIsEmpty(exdays)) exdays = 1000000;
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
    }
    return "";
}