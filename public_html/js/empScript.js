/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var empDBName="EMP_DB";
var empRelName="EMPData02";
var connToken="90938833|-31948835571786847|90945729";
var jpdbBaseURL="http://api.login2explore.com:5577";
var jpdbIRL="/api/irl";
var jpdbIML="/api/iml";


setBaseUrl(jpdbBaseURL);

$(document).ready(function(){
    $("#id").focus();
    initEmpForm();
    
    getFirst();
    getLast();
    checkForNoOrOneRec();
});


function disableForm(ctrl)
{
    $("#id").prop("disabled",ctrl);
    $("#name").prop("disabled",ctrl);
    $("#salary").prop("disabled",ctrl);
    $("#hra").prop("disabled",ctrl);
    $("#da").prop("disabled",ctrl);
    $("#deduction").prop("disabled",ctrl);
}

function disableCtrl(ctrl)
{
    $("#new").prop("disabled",ctrl);
    $("#save").prop("disabled",ctrl);
    $("#reset").prop("disabled",ctrl);
    $("#change").prop("disabled",ctrl);
    $("#edit").prop("disabled",ctrl);
    
}

function disableNav(ctrl)
{
    $("#first").prop("disabled",ctrl);
    $("#prev").prop("disabled",ctrl);
    $("#next").prop("disabled",ctrl);
    $("#last").prop("disabled",ctrl);
 
}

function initEmpForm()
{
    localStorage.removeItem("first_rec");
    localStorage.removeItem("last_rec");
    localStorage.removeItem("cur_rec");
    console.log("Init Loaded");
}

function getFirst()
{
    
    
    var firstReq=createFIRST_RECORDRequest(connToken,empDBName,empRelName);
    jQuery.ajaxSetup({async:false});
    var result=executeCommandAtGivenBaseUrl(firstReq,jpdbBaseURL,jpdbIRL);
    setFirstRecord(result);
    showData(result);
    jQuery.ajaxSetup({async:true});
    $("#id").prop("disabled",true);
    $("#first").prop("disabled",true);
    $("#prev").prop("disabled",true);
    $("#next").prop("disabled",false);
    $("#save").prop("disabled",true);
}

function getPrev()
{
    if(getCurRecordNo()===getFirstRecordNo())
    {
        $("#prev").prop("disabled",true);
        $("#first").prop("disabled",true);
    }
    
    var prevRequest=createPREV_RECORDRequest(connToken,empDBName,empRelName,getCurRecordNo());
    jQuery.ajaxSetup({async:false});
    var result=executeCommandAtGivenBaseUrl(prevRequest,jpdbBaseURL,jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async:true});
    setCurRecord(result);
    if(getCurRecordNo()===getFirstRecordNo())
    {
        $("#prev").prop("disabled",true);
        $("#first").prop("disabled",true);
    }
    $("#save").prop("disabled",true);
    
}

function getNext()
{
    if(getCurRecordNo()===getLastRecordNo())
    {
        $("#next").prop("disabled",true);
        $("#last").prop("disabled",true);
    }
    
    var nextRequest=createNEXT_RECORDRequest(connToken,empDBName,empRelName,getCurRecordNo());
    jQuery.ajaxSetup({async:false});
    var result=executeCommandAtGivenBaseUrl(nextRequest,jpdbBaseURL,jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async:true});
    setCurRecord(result);
    if(getCurRecordNo()===getLastRecordNo())
    {
        $("#next").prop("disabled",true);
        $("#last").prop("disabled",true);
    }
    $("#save").prop("disabled",true);
    
}

function getLast()
{
    
    
    var lastReq=createLAST_RECORDRequest(connToken,empDBName,empRelName);
    jQuery.ajaxSetup({async:false});
    var result=executeCommandAtGivenBaseUrl(lastReq,jpdbBaseURL,jpdbIRL);
    setLastRecord(result);
    showData(result);
    jQuery.ajaxSetup({async:true});
    
}

function setFirstRecord(jsonObj)
{
    var rec=JSON.parse(jsonObj.data).rec_no;
    localStorage.setItem("first_rec",rec);
}

function setLastRecord(jsonObj)
{
    var rec=JSON.parse(jsonObj.data).rec_no;
    localStorage.setItem("last_rec",rec);
}

function setCurRecord(jsonObj)
{
    var rec=JSON.parse(jsonObj.data).rec_no;
    localStorage.setItem("cur_rec",rec);
}

function getCurRecordNo()
{
    return localStorage.getItem("cur_rec");
}

function getLastRecordNo()
{
    return localStorage.getItem("last_rec");
}

function getFirstRecordNo()
{
    return localStorage.getItem("first_rec");
}

function showData(jsonObj)
{
    if(jsonObj.status===400)
    {
        return;
    }
    fillData(jsonObj);
    disableForm(true);
    disableNav(false);
    
    $("#new").prop("disabled",false);
    $("#save").prop("disabled",true);
    $("#reset").prop("disabled",true);
    $("#change").prop("disabled",true);
    $("#edit").prop("disabled",false);
    
    if(getCurRecordNo()===getLastRecordNo())
    {
        $("#next").prop("disabled",true);
        $("#last").prop("disabled",true);
    }
    
    if(getCurRecordNo()===getFirstRecordNo())
    {
        $("#prev").prop("disabled",true);
        $("#first").prop("disabled",true);
    }
}

function getNewForm()
{
    setEmpty();
    
    disableForm(false );
    $("#id").focus();
    disableNav(true);
    disableCtrl(true);
    
    $("#reset").prop("disabled",false);
    $("#save").prop("disabled",false);
}

function setEmpty()
{
    $("#id").val('');
    $("#name").val('');
    $("#salary").val('');
    $("#hra").val('');
    $("#da").val('');
    $("#deduction").val('');
}

function editForm()
{
    disableForm(false);
    $("#id").prop("disabled",true);
    $("#name").focus();
    
    disableNav(true);
    disableCtrl(true);
    $("#change").prop("disabled",false);
    $("#reset").prop("disabled",false);
}

function checkForNoOrOneRec()
{
     if(noRecord())
     {
         
         disableForm(true);
         disableNav(true);
         disableCtrl(true);
         $("#new").prop("disabled",false);
     }
     if(oneRecord())
     {
         disableNav(true);
         disableForm(true);
         disableCtrl(true);
         $("#new").prop("disabled",false);
         $("#edit").prop("disabled",false);
     }
}

function oneRecord()
{
    if(noRecord)
        return false;
    else if(getLastrec()===getFirstRec())
    {
        return true;
    }
    return false;
        
        
}

function noRecord()
{
    
    return localStorage.getItem("first_rec")==="undefined";
}

function resetFun()
{
    disableCtrl(true);
    disableNav(false);
    
    var getCurReq=createGET_BY_RECORDRequest(connToken,empDBName,empRelName,getCurRecordNo());
    jQuery.ajaxSetup({async:false});
    var result=executeCommandAtGivenBaseUrl(getCurReq,jpdbBaseURL,jpdbIRL);
    showData(result);
    jQuery.ajaxSetup({async:true});
    
    if(noRecord()||oneRecord())
    {
        disableNav(true);    
    }
    
    if(noRecord())
    {
        
        setEmpty();
        $("#edit").prop("disabled",true);
    }else{
        $("#edit").prop("disabled",false);
    }
    
    disableForm(true);
    $("#new").prop("disabled",false);
}

function validateData()
{
    var id,name,sal,da,hra,dect;
    id=$("#id").val();
    name=$("#name").val();
    sal=$("#salary").val();
    da=$("#hra").val();
    hra=$("#da").val();
    dect=$("#deduction").val();
    
    if(id==='')
    {
        alert("Id missing");
        $("#id").focus();
        return '';
    }
    
    if(name==='')
    {
        alert("name missing");
        $("#name").focus();
        return '';
    }
    
    if(sal==='')
    {
        alert("Salary missing");
        $("#salary").focus();
        return '';
    }
    
    if(hra==='')
    {
        alert("hra missing");
        $("#hra").focus();
        return '';
    }
    
    if(da==='')
    {
        alert("Da missing");
        $("#da").focus();
        return '';
    }
    
    if(dect==='')
    {
        alert("Deduction is missing");
        $("#deduction").focus();
        return '';
    }
    
    var jsonString={
        id:id,
        name:name,
        salary:sal,
        hra:hra,
        da:da,
        deduction:dect
    };
    return JSON.stringify(jsonString);
}


function saveData()
{
    var jsonStrObj=validateData();
    if(jsonStrObj==='')
    {
        return '';
    }
    var putRequest=createPUTRequest(connToken,jsonStrObj,empDBName,empRelName);
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(putRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    if(noRecord())
    {
        setFirstRecord(resJsonObj);
    }
    setLastRecord(resJsonObj);
    setCurRecord(resJsonObj);
    resetFun();
    
}

function changeData()
{
    var jsonStrObj=validateData();
    if(jsonStrObj=='')
    {
        return '';
    }
    
    var changeRequest=createUPDATERecordRequest(connToken,jsonStrObj,empDBName,empRelName,getCurRecordNo());
    
    jQuery.ajaxSetup({async:false});
    var resJsonObj=executeCommandAtGivenBaseUrl(changeRequest,jpdbBaseURL,jpdbIML);
    jQuery.ajaxSetup({async:true});
    console.log(resJsonObj);
    $("#id").prop('disabled',true);
    resetFun();
}

function getEmpIdAsJsonObj()
{
    var id=$("#id").val();
    var jsonStr={
        id:id
    };
    
    return JSON.stringify(jsonStr);
}


function fillData(jsonObj)
{
    
    var data=JSON.parse(jsonObj.data).record;
    console.log(data);
    setCurRecord(jsonObj);
    $("#id").val(data.id);
    $("#name").val(data.name);
    $("#salary").val(data.salary);
    $("#hra").val(data.hra);
    $("#da").val(data.da);
    $("#deduction").val(data.deduction);
}

function getEmp()
{
    var empIdJsonObj=getEmpIdAsJsonObj();
    var getRequest=createGET_BY_KEYRequest(connToken,empDBName,empRelName,empIdJsonObj);
    
    jQuery.ajaxSetup({async:false});
    
    var resJsonObj=executeCommandAtGivenBaseUrl(getRequest,jpdbBaseURL,jpdbIRL);
    
    jQuery.ajaxSetup({async:true});
    
    console.log(resJsonObj);
    if(resJsonObj.status===400)
    {
        
        $("#save").prop("disabled",false);
        $("#reset").prop("disabled",false);
        $("#name").focus();
    }else if(resJsonObj.status===200)
    {
        
        
        $("#id").prop('disabled',true);
        setCurRecord(resJsonObj);
        showData(resJsonObj);
        
        $("#save").prop("disabled",true);
        $("#reset").prop("disabled",false);
        
        
        
    }
    
    
    
}