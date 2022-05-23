const express   = require('express');
const router    = express.Router();
const AdminLog  = require('../models/AdminLog');
const verify    = require('./verifyToken');

//Gets all admin logs
router.get('/', verify, async (req, res, next) => {
    try {
        const adminLogs = await AdminLog.find().sort({date: 'desc'});
        res.json(adminLogs);
    } catch (err) {
        err.message = "Could not get adminLog";
        err.status = 400;
        err.instance = `/logs/adminLogs/`;
        next(err);
    };
});

//Gets adminLogs by item id
router.get('/item/:id', verify, async (req, res, next) => {
    try {
        const adminLogs = await AdminLog.find({itemId: req.params.id});
        res.json(adminLogs);
    } catch (err) {
        err.message = "Could not get adminLog by item";
        err.status = 400;
        err.instance = `/logs/adminLogs/items/${req.params.id}`;
        next(err);
    }
});

//Gets adminLogs by user id
router.get('/user/:id', verify, async (req, res, next) => {
    try {
        const adminLogs = await AdminLog.find({userId: req.params.id});
        res.json(adminLogs);
    } catch (err) {
        err.message = "Could not get adminLog by user";
        err.status = 400;
        err.instance = `/logs/adminLogs/user/${req.params.id}`;
        next(err);
    }
});

//Creates an adminLog 
router.post('/', verify, async (req, res, next) => {
    const adminLog = new AdminLog({
        itemId:     req.body.itemId,
        userId:     req.body.userId,
        adminId:    req.body.adminId,
        action:     req.body.action,
        content:    req.body.content
    });

    try {
        const savedAdminLog = await adminLog.save();
        res.json(savedAdminLog);
    }
    catch (err) {
        err.message = "Could not create adminLog";
        err.status = 400;
        err.instance = `/logs/adminLogs/`;
        next(err);
    }
});

//Deletes an adminLog by Id
router.delete('/:id', verify, async (req, res, next) => {
    try {
        const removedAdminLog = await AdminLog.deleteOne({_id: req.params.id});
        res.json(removedAdminLog);
    } catch (err) { 
        err.message = "Could not delete adminLog";
        err.status = 400;
        err.instance = `/logs/adminLogs/${req.params.id}`;
        next(err);
    }
});
//old self signed
/* 
-----BEGIN CERTIFICATE-----
MIIEMTCCAxmgAwIBAgIUJ0Kq5uZdSmWbmnDs5rQ2nKUP4QQwDQYJKoZIhvcNAQEL
BQAwgacxCzAJBgNVBAYTAlVTMQ4wDAYDVQQIDAVUZXhhczEUMBIGA1UEBwwLU2Fu
IEFudG9uaW8xDTALBgNVBAoMBFVTQUYxDjAMBgNVBAsMBVNXVFNTMR4wHAYDVQQD
DBV3ZWItYXBpLWludmVudG9yeS1hcHAxMzAxBgkqhkiG9w0BCQEWJFNXVFNTLlgt
VHJvb3AuT2ZmaWNlT3JnYm94QHVzLmFmLm1pbDAeFw0yMTA1MTQxNDEwMTBaFw0y
MjA1MTQxNDEwMTBaMIGnMQswCQYDVQQGEwJVUzEOMAwGA1UECAwFVGV4YXMxFDAS
BgNVBAcMC1NhbiBBbnRvbmlvMQ0wCwYDVQQKDARVU0FGMQ4wDAYDVQQLDAVTV1RT
UzEeMBwGA1UEAwwVd2ViLWFwaS1pbnZlbnRvcnktYXBwMTMwMQYJKoZIhvcNAQkB
FiRTV1RTUy5YLVRyb29wLk9mZmljZU9yZ2JveEB1cy5hZi5taWwwggEiMA0GCSqG
SIb3DQEBAQUAA4IBDwAwggEKAoIBAQC2lKHSrDrNmG7I9PITJ2J0NeN8vbsjNiP0
2fiDjQGN/EomfHmejPzbgFn0VGAG/DPPZgbqSq7CTdBtP/xnXlQ5ChAJcpBkQUuW
UNnulXFBxuxheFSCvHyZ+1Y32ENgXd+GGmrl63O3vqOh9dAz7VOCwD1rdRypH1Q/
iQVEtkXUhJi5NYcKgiQDGpvQf8S9/xR7OjgrQ5dmiAMnoCu0IrYSWEh2Q2uxpb9z
2iHWZi2e8spaTEXkl/5iWx68o/e6aCEDVxidpGCWBCxsoNzlU8Ty8oDpKcui0S6D
NKmwqSsj3h2opmZUnhSq2bAz9FVhmAJ+Eycyu3L1kJ9AiqwoyuNVAgMBAAGjUzBR
MB0GA1UdDgQWBBSFcsy7lPLxfLmWuK5m2gLdftcDbzAfBgNVHSMEGDAWgBSFcsy7
lPLxfLmWuK5m2gLdftcDbzAPBgNVHRMBAf8EBTADAQH/MA0GCSqGSIb3DQEBCwUA
A4IBAQBifVGg5e4VsTgoxqrWrlJXrbK/y8gxAp93XQqCkiLOaN6FGXRDFzMvf3g/
sfpwHF8XZeXV6fbu16chXxkDE5h30f8jsMa1On7X9MNjgrARfA2djgck0OxdLAta
zYUV8nfcCCwmbf/2Fj5tgOb7I3L1q6i2fhawRwSe90rPw2X2/OCo88Cy14HKicdR
OEbmXRm/NYbbfEYgASFLMQDj+JZbd7p8pXKiiAR5QoEWvTahcBZ/N96wuUCI3rkh
d+74zCB1u0KfBzpbJzF7+L58k+41oVyjBSWpSUWz+OtqBwf0F3C8TVCVo8lYLagN
nBOuwixxVlJHdqLJK6vp5I3MMxiS
-----END CERTIFICATE-----
-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC2lKHSrDrNmG7I
9PITJ2J0NeN8vbsjNiP02fiDjQGN/EomfHmejPzbgFn0VGAG/DPPZgbqSq7CTdBt
P/xnXlQ5ChAJcpBkQUuWUNnulXFBxuxheFSCvHyZ+1Y32ENgXd+GGmrl63O3vqOh
9dAz7VOCwD1rdRypH1Q/iQVEtkXUhJi5NYcKgiQDGpvQf8S9/xR7OjgrQ5dmiAMn
oCu0IrYSWEh2Q2uxpb9z2iHWZi2e8spaTEXkl/5iWx68o/e6aCEDVxidpGCWBCxs
oNzlU8Ty8oDpKcui0S6DNKmwqSsj3h2opmZUnhSq2bAz9FVhmAJ+Eycyu3L1kJ9A
iqwoyuNVAgMBAAECggEAN6x669K425hvr7eBWXXY/7au94qjVclcjX0p2nNU1gbo
VXP/Yel78TLiOy6/WWHuKn/h++9p+rXfqHCqdpq88+etnDPi8681bVCaI7ZOItCV
o+MdYgA3vnx1ffHkGa6GSk4j6pgxYQYwv2JFapAjtusHz4yWgLuc5QLTKHCsOnDv
yvfg3XrkSPr4bh7gRApp0wPg8btS6juRrZSUTAcGX/xbprF44mlPy711m9XxqNFY
DxbJ49P0bnDaSHMzBORo1ovRLc7bpgJk1Ukj37FSmUDYCpxMH18ZWDXa2apzsP9m
2T/eQNz49CsKm2L77Fy0U44Izo4XMIbpq/q+3RSOwQKBgQDwSJQoyzItOyImqNwH
mnej++m87gTeATxYwb/P121O4ueRMFT6gQEql+9sDJtAxOs/ItTnsJsT8j0I64qg
zFJbDJkGdOoNw6d6htCroMQaVKsKQlLEA6prCRzi62HtTXJwigXV/ARAoeHFQrov
Jt0m8+0NYkclZ+Uryoh13AoQ7wKBgQDChdkr9mZITqQzCjx1KLiofETz5CIsuB7U
tVJ/7ZNZKG+/OkkKqITIpnTWqxrkq0JbdFr3ykEQHuJUNi2wZUdnVck+t8rN8VYz
vxnctaJ+amERQLZasAUJr5lGQ6xSmORMrP258cUnpU4Er3buE+GWQi0dwJVu+vCZ
IyWIL2ZH+wKBgAxxlcqvC0AwacpawFpcc4m4iBhSs0nUAo4OKqLW40BMm/V27U+z
0p2kFLAhzwCBsjUo1qHREZbs2qBVom5FZpZ0hpBBCcYAtfGwfaoFv2IltF3ppWOl
VPQKGsbdrcqeUijl3PuB+65lM84FcKL0fkuAImypBEo5oTKtYHfKF3NdAoGBAJTE
3UT8G1mtm3LVn0tTK3bgI7QLg/+DiUDQtBnWztxfSqeLohUesP7sH2uWTOkZ+ZQM
Nw5PhtcXZ61UCjlgG+3x9AmdcuNycaT9wH/GAlKAdWBGh7Bv8kpoG+dbFk3NVL03
iI1PVKNvj22R7HlEh0Dtt6eLhD3ueVgFQ00WQzlFAoGAd+EBYKBQEnRX/Xc3CJ8M
8ujwwITcJFcbuE64TQWldFZtysQEerFKrBBYQyUBWzuD6B3x/Kd0ceucNEVKmZcD
mySB4IWC4OXca71ohEWQpnRorzoSaWM997vXI3/cDIORbFYRaRytr6ygStjApZEI
1nlHxUlP/rmkP1lbt9NmHYY=
-----END PRIVATE KEY-----
*/

module.exports = router;