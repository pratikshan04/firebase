-----------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FORCE VIEW DEFAULT_PRODUCT_ITEM_VIEW
AS
  SELECT IM.ITEM_ID ,
    'Y' DEFAULT_PRODUCT_ITEM ,
    P.PRODUCT_ID
  FROM ITEM_MASTER IM,
    PRODUCTS P
  WHERE IM.ACTIVE!               ='D'
  AND P.PRODUCT_SEARCH_PARTNUMBER=IM.PART_NUMBER
  AND P.PRODUCT_ID               =IM.PRODUCT_ID;  

  
-----------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FORCE VIEW MANUFACTURER_DISPLAY_NAME
AS 
  SELECT ITEM_ID,
    LCFV.TEXT_FIELD_VALUE MANUFACTURER_DISPLAY_NAME
  FROM item_custom_field_values ICFV,
    CUSTOM_FIELDS CF,
    LOC_CUSTOM_FIELD_VALUES LCFV
  WHERE upper(field_name)            =upper('Manufacturer_Display_Name')
  AND data_entity                    ='ITEM'
  AND ICFV.CUSTOM_FIELD_ID           =CF.CUSTOM_FIELD_ID
  AND LCFV.LOC_CUSTOM_FIELD_VALUE_ID = ICFV.LOC_CUSTOM_FIELD_VALUE_ID;  

  
-----------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FORCE VIEW BEST_SELLER
AS
  SELECT ITEM_ID,
    LCFV.NUMERIC_FIELD_VALUE BEST_SELLER
  FROM item_custom_field_values ICFV,
    CUSTOM_FIELDS CF,
    LOC_CUSTOM_FIELD_VALUES LCFV
  WHERE upper(field_name)            =upper('BEST SELLER')
  AND data_entity                    ='ITEM'
  AND ICFV.custom_field_id           =CF.custom_field_id
  AND LCFV.LOC_CUSTOM_FIELD_VALUE_ID = ICFV.LOC_CUSTOM_FIELD_VALUE_ID;  

  
-----------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FORCE VIEW EXTERNAL_HITS
AS
  SELECT ITEM_ID,
    LCFV.NUMERIC_FIELD_VALUE EXTERNAL_HITS
  FROM item_custom_field_values ICFV,
    CUSTOM_FIELDS CF,
    LOC_CUSTOM_FIELD_VALUES LCFV
  WHERE upper(field_name)            =upper('EXTERNAL_RANKING')
  AND data_entity                    ='ITEM'
  AND ICFV.CUSTOM_FIELD_ID           =CF.CUSTOM_FIELD_ID
  AND LCFV.LOC_CUSTOM_FIELD_VALUE_ID = ICFV.LOC_CUSTOM_FIELD_VALUE_ID;
  
-----------------------------------------------------------------------------------------------------------------------------------------------------------

CREATE OR REPLACE FORCE VIEW CATEGORY_PATH_VIEW1
AS
  SELECT SUBSTR(SYS_CONNECT_BY_PATH(TT.TAXONOMY_TREE_ID,':'),2) CATEGORY_CODE_PATH,
    SUBSTR(SYS_CONNECT_BY_PATH(TT.CATEGORY_NAME, '/*/'), 4) CATEGORY_NAME_PATH,
    TT.TAXONOMY_TREE_ID T3_TAXONOMY_TREE_ID
  FROM TAXONOMY_TREE TT
    START WITH TT.LEVEL_NUMBER                   =1
    CONNECT BY NOCYCLE PRIOR TT.TAXONOMY_TREE_ID = TT.PARENT_TT_ID
  ORDER SIBLINGS BY TT.DISP_SEQ;  

--------------------------------------------------------Changed for Fairmount implementation--------------------------------------------------------------
CREATE OR REPLACE FORCE VIEW  ITEM_MASTER_PRICE_VIEW AS
SELECT IM.ITEM_ID,
IM.PARTNUMBER_KEYWORDS,
IM.KEYWORDS,
IM.MANUFACTURER_PART_NUMBER,
im.part_number,
im.popularity,
im.manufacturer_id,
im.brand_id,
im.upc,
IM.NET_PRICE,
im.ALT_PART_NUMBER1,
im.ALT_PART_NUMBER2,
im.display_online,
im.active,
IM.HITS,
IM.UPDATED_DATETIME,
IM.SALES_UOM,
IM.PRODUCT_ID,
IM.LIST_PRICE,
Im.STATUS,
IP.CLEARANCE
FROM item_master im,ITEM_PRICES IP
WHERE IP.ITEM_ID=IM.ITEM_ID
AND im.active = 'Y'
AND im.display_online ='Y'
AND Ip.STATUS = 'A'
; 

CREATE OR REPLACE FORCE VIEW SEARCH_ITEM_MASTER_VIEW_V8 AS
WITH t1 AS
  (SELECT nvl2(ICV.item_classificaton_id,ICV.item_classificaton_id
    || '||'
    || IM.ITEM_ID,IM.ITEM_ID) KEY,
    NVL2(ICV.CATEGORY_CODE_PATH,'0:'
    ||ICV.CATEGORY_CODE_PATH,'0') CATEGORY_CODE_PATH,
    icv.CATEGORY_NAME_PATH,
    ICV.item_classificaton_id,
    im.item_id,
    IM.PARTNUMBER_KEYWORDS PARTNUMBER_KEYWORDS,
    IM.KEYWORDS ||' ; '||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    B.BRAND_NAME ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    M.manufacturer_name ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')   || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '') || ' ; ' ||
    REGEXP_REPLACE(NVL(lim.short_desc,LIM.INVOICE_DESC), '[^a-zA-Z0-9-]', '') || ' ; ' ||
    LP.PRODUCT_ITEM_KEYWORDS || ' ; ' ||
    LP.PRODUCT_PARTNUMBER_KEYWORDS  AS 
    KEYWORDS,
	IM.KEYWORDS ||' ; '||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    B.BRAND_NAME ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    M.manufacturer_name ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')   || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '') || ' ; ' ||
    REGEXP_REPLACE(NVL(lim.short_desc,LIM.INVOICE_DESC), '[^a-zA-Z0-9-]', '') || ' ; ' ||
    LP.PRODUCT_ITEM_KEYWORDS || ' ; ' ||
    LP.PRODUCT_PARTNUMBER_KEYWORDS AS PRODUCT_ITEM_KEYWORDS,
    im.part_number,
    im.popularity,
    im.manufacturer_id,
    im.brand_id,
    im.manufacturer_part_number,
    im.upc,
    IM.NET_PRICE,
    LIM.PAGE_TITLE,
    im.ALT_PART_NUMBER1,
    im.ALT_PART_NUMBER2,
    im.display_online,
    im.active,
    IM.HITS,
    EH.EXTERNAL_HITS,
    BS.BEST_SELLER,
    MDN.MANUFACTURER_DISPLAY_NAME,
    ICVV.FIELD_VALUE COLLECTION_KEYWORD,
    nvl2(LP.PRODUCT_ID,DPI.DEFAULT_PRODUCT_ITEM,'Y') DEFAULT_PRODUCT_ITEM,
    m.manufacturer_name,
    b.brand_name,
    ICV.PRODUCT_CATEGORY_ID,
    LP.PRODUCT_ID PRODUCT_ID,
    ICV.PRODUCT_category,
    ICV.LEVEL1_CATEGORY,
    ICV.TAXONOMY_ID,
    NVL2(ICV.DEFAULT_CATEGORY,ICV.DEFAULT_CATEGORY,'Y') DEFAULT_CATEGORY,
    NVL(lim.short_desc,LIM.INVOICE_DESC) SHORT_DESC,
    ICV.display_priority,
    b.brand_image,
    ii.image_name ITEM_IMAGE,
    ii.image_type,
    NVL2(IM.UPDATED_DATETIME,IM.UPDATED_DATETIME,SYSDATE) LAST_UPDATED,
    NVL(P.PRODUCT_NAME,M.MANUFACTURER_NAME
    ||' '
    ||NVL(IM.MANUFACTURER_PART_NUMBER,IM.PART_NUMBER)) PRODUCT_NAME,
    NVL(P.PRODUCT_NUMBER,NVL(IM.MANUFACTURER_PART_NUMBER,IM.PART_NUMBER)) PRODUCT_NUMBER,
    LP.PRODUCT_PARTNUMBER_KEYWORDS PRODUCT_PARTNUMBER_KEYWORDS,
    P.PRODUCT_ITEM_COUNT,
    IM.SALES_UOM,
    LIM.LONG_DESC1,
    LIM.LONG_DESC2,
    P.PRODUCT_DESC,
    P.PRODUCT_IMAGE_NAME,
    P.PRODUCT_IMAGE_TYPE,
    IM.LIST_PRICE,
    IM.CLEARANCE
  FROM ITEM_MASTER_PRICE_VIEW im,--item_master im,
    manufacturer m,
    BRANDS B,
    (SELECT *
    FROM CATEGORY_PATH_VIEW1 CP,
      ITEM_CATEGORY_VIEW IV
    WHERE CP.t3_TAXONOMY_TREE_ID=IV.PRODUCT_CATEGORY_ID
    ) ICV,
    loc_item_master lim,
    item_images ii,
    ITEM_CF_VALUES_VIEW ICVV,
    (SELECT ITEM_ID IFAV_ITEM_ID,
      (RTRIM (XMLAGG (xmlelement (ATTR_VAL, LAV.ATTRIBUTE_VALUE
      || ';')).extract ('//text()'))) FILTER_ATTRIBUTE_VALUES
    FROM ITEM_ATTRIBUTE_VALUES IAV,
      LOC_ATTRIBUTE_VALUES LAV,
      attributes a,
      (SELECT ATTR_NAME FROM DEFAULT_FILTER_ATTRIBUTE
      UNION ALL
      SELECT 'attr_Finish' FROM dual
      ) DFA
    WHERE IAV.LOC_ATTRIBUTE_VALUE_ID=LAV.LOC_ATTRIBUTE_VALUE_ID
    AND iav.attribute_id            =a.attribute_id
    AND UPPER(DFA.ATTR_NAME) LIKE UPPER('attr_%')
    AND UPPER(a.ATTRIBUTE_NAME)=UPPER(REPLACE(DFA.ATTR_NAME,'attr_',''))
    GROUP BY ITEM_ID
    ) IFAV,
    --PRODUCTS P,
    (
    SELECT LP.PRODUCT_DESC1
      ||' '
      || LP.PRODUCT_DESC2 AS PRODUCT_DESC,
      PI.IMAGE_NAME       AS PRODUCT_IMAGE_NAME,
      PI.IMAGE_TYPE       AS PRODUCT_IMAGE_TYPE ,
      PRD.*,
      IM2.PRODUCT_ITEM_COUNT
    FROM PRODUCTS PRD,
      (SELECT IM.PRODUCT_ID,
        COUNT(1) PRODUCT_ITEM_COUNT
      FROM ITEM_MASTER IM
      WHERE IM.ACTIVE!='D'
      GROUP BY IM.PRODUCT_ID
      ) IM2,
      LOC_PRODUCTS LP,
      PRODUCT_IMAGES PI
    WHERE PRD.PRODUCT_ID        = IM2.PRODUCT_ID(+)
    AND LP.PRODUCT_ID(+)        = PRD.PRODUCT_ID
    AND PI.PRODUCT_IMAGES_ID (+)= LP.PRODUCT_IMAGES_ID
    AND NVL(PRD.STATUS,'Y')     = 'Y'
    ) P,
    LOC_PRODUCTS LP,
    EXTERNAL_HITS EH,
    BEST_SELLER BS,
    MANUFACTURER_DISPLAY_NAME MDN,
    DEFAULT_PRODUCT_ITEM_VIEW DPI
  WHERE m.manufacturer_id(+) = im.manufacturer_id
  AND b.brand_id(+)          = im.brand_id
  AND ICV.item_id(+)         = im.item_id
  AND im.item_id             = lim.item_id(+)
  AND lim.locale_id(+)       = 1
  AND ii.item_image_id(+)    = lim.item_image_id
  AND ICVV.field_name(+)     = 'Collections'
  AND IM.ITEM_ID             = ICVV.ITEM_ID(+)
  AND EH.ITEM_ID(+)          = IM.ITEM_ID
  AND BS.ITEM_ID(+)          = IM.ITEM_ID
  AND DPI.ITEM_ID(+)         = IM.ITEM_ID
  AND P.PRODUCT_ID(+)        =IM.PRODUCT_ID
  AND LP.PRODUCT_ID(+)       =P.PRODUCT_ID
  AND LP.LOCALE_ID(+)        =1
  AND IM.ITEM_ID             =IFAV.IFAV_ITEM_ID(+)
  AND IM.ITEM_ID             =MDN.ITEM_ID(+)
  ),
  t2 AS
  (SELECT LISTAGG(iavv.attribute_name
    ||'|~|'
    || iavv.attribute_value
    ||' '
    || iavv.attribute_uom, '}~}') WITHIN GROUP (
  ORDER BY filter_seq) ATTRIBUTE_VALUES ,
    iavv.item_id T2_ITEM_ID,
    ic.item_classificaton_id T2_ITEM_CLASSIFICATION_ID
  FROM iav_view iavv,
    category_attributes ca,
    item_classification ic
  WHERE iavv.attribute_id = ca.attribute_id
  AND ca.filter_enabled   ='Y'
  AND iavv.item_id        = ic.item_id(+)
  AND ic.taxonomy_tree_id = ca.taxonomy_tree_id
  AND iavv.locale_id      =1
  GROUP BY iavv.item_id,
    IC.ITEM_CLASSIFICATON_ID
  ),
  T4 AS
  (SELECT LISTAGG(ICVV.FIELD_NAME
    ||'|~|'
    || ICVV.FIELD_VALUE , '}~}') WITHIN GROUP (
  ORDER BY ICVV.DISPLAY_SEQUENCE) CUSTOM_FIELD_VALUES ,
    ICVV.ITEM_ID T4_ITEM_ID
  FROM ITEM_CF_VALUES_VIEW ICVV
  GROUP BY ICVV.ITEM_ID
  )
SELECT KEY,
  ITEM_CLASSIFICATON_ID,
  ITEM_ID,
  PARTNUMBER_KEYWORDS,
  KEYWORDS,
  PART_NUMBER,
  POPULARITY,
  MANUFACTURER_ID,
  BRAND_ID,
  MANUFACTURER_PART_NUMBER,
  UPC,
  NET_PRICE,
  DISPLAY_ONLINE,
  ACTIVE,
  MANUFACTURER_NAME,
  BRAND_NAME,
  PRODUCT_CATEGORY_ID,
  PRODUCT_ID,
  PRODUCT_CATEGORY,
  COLLECTION_KEYWORD,
  LEVEL1_CATEGORY,
  TAXONOMY_ID,
  DEFAULT_CATEGORY,
  SHORT_DESC,
  DISPLAY_PRIORITY,
  BRAND_IMAGE,
  ITEM_IMAGE,
  IMAGE_TYPE,
  LAST_UPDATED ,
  PRODUCT_NAME,
  PRODUCT_NUMBER,
  PAGE_TITLE,
  BEST_SELLER,
  PRODUCT_ITEM_KEYWORDS,
  PRODUCT_PARTNUMBER_KEYWORDS,
  ATTRIBUTE_VALUES,
  T2_ITEM_ID,
  T2_ITEM_CLASSIFICATION_ID,
  HITS,
  CATEGORY_CODE_PATH,
  CATEGORY_NAME_PATH,
  EXTERNAL_HITS,
  NVL(DEFAULT_PRODUCT_ITEM,'N') DEFAULT_PRODUCT_ITEM,
  PRODUCT_ITEM_COUNT,
  CUSTOM_FIELD_VALUES,
  SALES_UOM,
  LONG_DESC1,
  LONG_DESC2,
  MANUFACTURER_DISPLAY_NAME,
  ALT_PART_NUMBER1,
  ALT_PART_NUMBER2,
  PRODUCT_DESC,
  PRODUCT_IMAGE_NAME,
  PRODUCT_IMAGE_TYPE,
  LIST_PRICE
FROM T1,
  T2,
  T4
WHERE T1.ITEM_ID            =T2.T2_ITEM_ID(+)
AND T1.ITEM_CLASSIFICATON_ID=T2.T2_ITEM_CLASSIFICATION_ID(+)
AND T1.ITEM_ID              = T4.T4_ITEM_ID(+);
-----------------------------------------------------------------------------------------------------------------------------------------------------------

 CREATE OR REPLACE FORCE VIEW SEARCH_ITEM_MASTER_VIEW_V8 AS
WITH t1 AS
  (SELECT nvl2(ICV.item_classificaton_id,ICV.item_classificaton_id
    || '||'
    || IM.ITEM_ID,IM.ITEM_ID) KEY,
    NVL2(ICV.CATEGORY_CODE_PATH,'0:'
    ||ICV.CATEGORY_CODE_PATH,'0') CATEGORY_CODE_PATH,
    icv.CATEGORY_NAME_PATH,
    ICV.item_classificaton_id,
    im.item_id,
    IM.PARTNUMBER_KEYWORDS PARTNUMBER_KEYWORDS,
    IM.KEYWORDS ||' ; '||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    B.BRAND_NAME ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    M.manufacturer_name ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')   || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '') || ' ; ' ||
    REGEXP_REPLACE(NVL(lim.short_desc,LIM.INVOICE_DESC), '[^a-zA-Z0-9-]', '') || ' ; ' ||
    LP.PRODUCT_ITEM_KEYWORDS || ' ; ' ||
    LP.PRODUCT_PARTNUMBER_KEYWORDS  AS 
    KEYWORDS,
	IM.KEYWORDS ||' ; '||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    B.BRAND_NAME ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    M.manufacturer_name ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')   || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '') || ' ; ' ||
    REGEXP_REPLACE(NVL(lim.short_desc,LIM.INVOICE_DESC), '[^a-zA-Z0-9-]', '') || ' ; ' ||
    LP.PRODUCT_ITEM_KEYWORDS || ' ; ' ||
    LP.PRODUCT_PARTNUMBER_KEYWORDS AS PRODUCT_ITEM_KEYWORDS,
    im.part_number,
    im.popularity,
    im.manufacturer_id,
    im.brand_id,
    im.manufacturer_part_number,
    im.upc,
    IM.NET_PRICE,
    LIM.PAGE_TITLE,
    im.ALT_PART_NUMBER1,
    im.ALT_PART_NUMBER2,
    im.display_online,
    im.active,
    IM.HITS,
    EH.EXTERNAL_HITS,
    BS.BEST_SELLER,
    MDN.MANUFACTURER_DISPLAY_NAME,
    ICVV.FIELD_VALUE COLLECTION_KEYWORD,
    nvl2(LP.PRODUCT_ID,DPI.DEFAULT_PRODUCT_ITEM,'Y') DEFAULT_PRODUCT_ITEM,
    m.manufacturer_name,
    b.brand_name,
    ICV.PRODUCT_CATEGORY_ID,
    LP.PRODUCT_ID PRODUCT_ID,
    --NVL(LP.PRODUCT_ID,0) PRODUCT_ID,
    ICV.PRODUCT_category,
    ICV.LEVEL1_CATEGORY,
    ICV.TAXONOMY_ID,
    NVL2(ICV.DEFAULT_CATEGORY,ICV.DEFAULT_CATEGORY,'Y') DEFAULT_CATEGORY,
    NVL(lim.short_desc,LIM.INVOICE_DESC) SHORT_DESC,
    ICV.display_priority,
    b.brand_image,
    ii.image_name ITEM_IMAGE,
    ii.image_type,
    NVL2(IM.UPDATED_DATETIME,IM.UPDATED_DATETIME,SYSDATE) LAST_UPDATED,
    NVL(P.PRODUCT_NAME,M.MANUFACTURER_NAME
    ||' '
    ||NVL(IM.MANUFACTURER_PART_NUMBER,IM.PART_NUMBER)) PRODUCT_NAME,
    NVL(P.PRODUCT_NUMBER,NVL(IM.MANUFACTURER_PART_NUMBER,IM.PART_NUMBER)) PRODUCT_NUMBER,
    LP.PRODUCT_PARTNUMBER_KEYWORDS PRODUCT_PARTNUMBER_KEYWORDS,
    P.PRODUCT_ITEM_COUNT,
    IM.SALES_UOM,
    LIM.LONG_DESC1,
    LIM.LONG_DESC2,
    P.PRODUCT_DESC,
    P.PRODUCT_IMAGE_NAME,
    P.PRODUCT_IMAGE_TYPE
  FROM item_master im,
    manufacturer m,
    BRANDS B,
    (SELECT *
    FROM CATEGORY_PATH_VIEW1 CP,
      ITEM_CATEGORY_VIEW IV
    WHERE CP.t3_TAXONOMY_TREE_ID=IV.PRODUCT_CATEGORY_ID
    ) ICV,
    loc_item_master lim,
    item_images ii,
    ITEM_CF_VALUES_VIEW ICVV,
    (SELECT ITEM_ID IFAV_ITEM_ID,
      (RTRIM (XMLAGG (xmlelement (ATTR_VAL, LAV.ATTRIBUTE_VALUE
      || ';')).extract ('//text()'))) FILTER_ATTRIBUTE_VALUES
    FROM ITEM_ATTRIBUTE_VALUES IAV,
      LOC_ATTRIBUTE_VALUES LAV,
      attributes a,
      (SELECT ATTR_NAME FROM DEFAULT_FILTER_ATTRIBUTE
      UNION ALL
      SELECT 'attr_Finish' FROM dual
      ) DFA
    WHERE IAV.LOC_ATTRIBUTE_VALUE_ID=LAV.LOC_ATTRIBUTE_VALUE_ID
    AND iav.attribute_id            =a.attribute_id
    AND UPPER(DFA.ATTR_NAME) LIKE UPPER('attr_%')
    AND UPPER(a.ATTRIBUTE_NAME)=UPPER(REPLACE(DFA.ATTR_NAME,'attr_',''))
    GROUP BY ITEM_ID
    ) IFAV,
    --PRODUCTS P,
    (
    SELECT LP.PRODUCT_DESC1
      ||' '
      || LP.PRODUCT_DESC2 AS PRODUCT_DESC,
      PI.IMAGE_NAME       AS PRODUCT_IMAGE_NAME,
      PI.IMAGE_TYPE       AS PRODUCT_IMAGE_TYPE ,
      PRD.*,
      IM2.PRODUCT_ITEM_COUNT
    FROM PRODUCTS PRD,
      (SELECT IM.PRODUCT_ID,
        COUNT(1) PRODUCT_ITEM_COUNT
      FROM ITEM_MASTER IM
      WHERE IM.ACTIVE!='D'
      GROUP BY IM.PRODUCT_ID
      ) IM2,
      LOC_PRODUCTS LP,
      PRODUCT_IMAGES PI
    WHERE PRD.PRODUCT_ID        = IM2.PRODUCT_ID(+)
    AND LP.PRODUCT_ID(+)        = PRD.PRODUCT_ID
    AND PI.PRODUCT_IMAGES_ID (+)= LP.PRODUCT_IMAGES_ID
    AND NVL(PRD.STATUS,'Y')     = 'Y'
    ) P,
    LOC_PRODUCTS LP,
    EXTERNAL_HITS EH,
    BEST_SELLER BS,
    MANUFACTURER_DISPLAY_NAME MDN,
    DEFAULT_PRODUCT_ITEM_VIEW DPI
  WHERE m.manufacturer_id(+) = im.manufacturer_id
  AND b.brand_id(+)          = im.brand_id
  AND ICV.item_id(+)         = im.item_id
  AND im.item_id             = lim.item_id(+)
  AND lim.locale_id(+)       = 1
  AND ii.item_image_id(+)    = lim.item_image_id
  AND ICVV.field_name(+)     = 'Collections'
  AND IM.ITEM_ID             = ICVV.ITEM_ID(+)
  AND EH.ITEM_ID(+)          = IM.ITEM_ID
  AND BS.ITEM_ID(+)          = IM.ITEM_ID
  AND DPI.ITEM_ID(+)         = IM.ITEM_ID
  AND P.PRODUCT_ID(+)        =IM.PRODUCT_ID
  AND LP.PRODUCT_ID(+)       =P.PRODUCT_ID
  AND LP.LOCALE_ID(+)        =1
  AND IM.ITEM_ID             =IFAV.IFAV_ITEM_ID(+)
  AND IM.ITEM_ID             =MDN.ITEM_ID(+)
  ),
  t2 AS
  (SELECT LISTAGG(iavv.attribute_name
    ||'|~|'
    || iavv.attribute_value
    ||' '
    || iavv.attribute_uom, '}~}') WITHIN GROUP (
  ORDER BY filter_seq) ATTRIBUTE_VALUES ,
    iavv.item_id T2_ITEM_ID,
    ic.item_classificaton_id T2_ITEM_CLASSIFICATION_ID
  FROM iav_view iavv,
    category_attributes ca,
    item_classification ic
  WHERE iavv.attribute_id = ca.attribute_id
  AND ca.filter_enabled   ='Y'
  AND iavv.item_id        = ic.item_id(+)
  AND ic.taxonomy_tree_id = ca.taxonomy_tree_id
  AND iavv.locale_id      =1
  GROUP BY iavv.item_id,
    IC.ITEM_CLASSIFICATON_ID
  ),
  T4 AS
  (SELECT LISTAGG(ICVV.FIELD_NAME
    ||'|~|'
    || ICVV.FIELD_VALUE , '}~}') WITHIN GROUP (
  ORDER BY ICVV.DISPLAY_SEQUENCE) CUSTOM_FIELD_VALUES ,
    ICVV.ITEM_ID T4_ITEM_ID
  FROM ITEM_CF_VALUES_VIEW ICVV
  GROUP BY ICVV.ITEM_ID
  )
SELECT KEY,
  ITEM_CLASSIFICATON_ID,
  ITEM_ID,
  PARTNUMBER_KEYWORDS,
  KEYWORDS,
  PART_NUMBER,
  POPULARITY,
  MANUFACTURER_ID,
  BRAND_ID,
  MANUFACTURER_PART_NUMBER,
  UPC,
  NET_PRICE,
  DISPLAY_ONLINE,
  ACTIVE,
  MANUFACTURER_NAME,
  BRAND_NAME,
  PRODUCT_CATEGORY_ID,
  PRODUCT_ID,
  PRODUCT_CATEGORY,
  COLLECTION_KEYWORD,
  LEVEL1_CATEGORY,
  TAXONOMY_ID,
  DEFAULT_CATEGORY,
  SHORT_DESC,
  DISPLAY_PRIORITY,
  BRAND_IMAGE,
  ITEM_IMAGE,
  IMAGE_TYPE,
  LAST_UPDATED ,
  PRODUCT_NAME,
  PRODUCT_NUMBER,
  PAGE_TITLE,
  BEST_SELLER,
  PRODUCT_ITEM_KEYWORDS,
  PRODUCT_PARTNUMBER_KEYWORDS,
  ATTRIBUTE_VALUES,
  T2_ITEM_ID,
  T2_ITEM_CLASSIFICATION_ID,
  HITS,
  CATEGORY_CODE_PATH,
  CATEGORY_NAME_PATH,
  EXTERNAL_HITS,
  NVL(DEFAULT_PRODUCT_ITEM,'N') DEFAULT_PRODUCT_ITEM,
  PRODUCT_ITEM_COUNT,
  CUSTOM_FIELD_VALUES,
  SALES_UOM,
  LONG_DESC1,
  LONG_DESC2,
  MANUFACTURER_DISPLAY_NAME,
  ALT_PART_NUMBER1,
  ALT_PART_NUMBER2,
  PRODUCT_DESC,
  PRODUCT_IMAGE_NAME,
  PRODUCT_IMAGE_TYPE
FROM T1,
  T2,
  T4
WHERE T1.ITEM_ID            =T2.T2_ITEM_ID(+)
AND T1.ITEM_CLASSIFICATON_ID=T2.T2_ITEM_CLASSIFICATION_ID(+)
AND T1.ITEM_ID              = T4.T4_ITEM_ID(+);
  
-----------------------------------------------------------------------------------------------------------------------------------------------------------
CREATE OR REPLACE FORCE VIEW  ITEM_MASTER_PRICE_VIEW AS
SELECT IM.ITEM_ID,
IM.PARTNUMBER_KEYWORDS,
IM.KEYWORDS,
IM.MANUFACTURER_PART_NUMBER,
im.part_number,
im.popularity,
im.manufacturer_id,
im.brand_id,
im.upc,
IM.NET_PRICE,
im.ALT_PART_NUMBER1,
im.ALT_PART_NUMBER2,
im.display_online,
im.active,
IM.HITS,
IM.UPDATED_DATETIME,
IM.SALES_UOM,
IM.PRODUCT_ID,
IM.LIST_PRICE,
Im.STATUS,
IP.CLEARANCE
FROM item_master im,ITEM_PRICES IP
WHERE IP.ITEM_ID=IM.ITEM_ID
AND im.active = 'Y'
AND im.display_online ='Y'
AND Ip.STATUS = 'A'
; 

  
-----------------------------------------------------------------------------------------------------------------------------------------------------------

  CREATE OR REPLACE FORCE VIEW SEARCH_ITEM_MASTER_VIEW_V8 AS 
  WITH t1 AS
  (SELECT nvl2(ICV.item_classificaton_id,ICV.item_classificaton_id
    || '||'
    || IM.ITEM_ID,IM.ITEM_ID) KEY,
    NVL2(ICV.CATEGORY_CODE_PATH,'0:'
    ||ICV.CATEGORY_CODE_PATH,'0') CATEGORY_CODE_PATH,
    icv.CATEGORY_NAME_PATH,
    ICV.item_classificaton_id,
    im.item_id,
    IM.PARTNUMBER_KEYWORDS PARTNUMBER_KEYWORDS,
    IM.KEYWORDS ||' ; '||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    B.BRAND_NAME ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    M.manufacturer_name ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name ||' '|| IM.MANUFACTURER_PART_NUMBER ||' ; '|| B.BRAND_NAME ||' '|| IM.MANUFACTURER_PART_NUMBER ||' ; '|| NVL(lim.short_desc,LIM.INVOICE_DESC), '[^a-zA-Z0-9 ;]', '')|| ' ; '  ||
    LP.PRODUCT_ITEM_KEYWORDS || ' ; ' ||
    LP.PRODUCT_PARTNUMBER_KEYWORDS  AS 
    KEYWORDS,
	IM.KEYWORDS ||' ; '||
    REGEXP_REPLACE(B.BRAND_NAME, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name, '[^a-zA-Z0-9]', '') ||' '|| IM.MANUFACTURER_PART_NUMBER || ' ; ' ||
    B.BRAND_NAME ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    M.manufacturer_name ||' '|| REGEXP_REPLACE(IM.MANUFACTURER_PART_NUMBER, '[^a-zA-Z0-9]', '')  || ' ; ' ||
    REGEXP_REPLACE(M.manufacturer_name ||' '|| IM.MANUFACTURER_PART_NUMBER ||' ; '|| B.BRAND_NAME ||' '|| IM.MANUFACTURER_PART_NUMBER ||' ; '|| NVL(lim.short_desc,LIM.INVOICE_DESC), '[^a-zA-Z0-9 ;]', '')|| ' ; ' ||
    LP.PRODUCT_ITEM_KEYWORDS || ' ; ' ||
    LP.PRODUCT_PARTNUMBER_KEYWORDS AS PRODUCT_ITEM_KEYWORDS,
    im.part_number,
    im.popularity,
    im.manufacturer_id,
    im.brand_id,
    im.manufacturer_part_number,
    im.upc,
    IM.NET_PRICE,
    LIM.PAGE_TITLE,
    im.ALT_PART_NUMBER1,
    im.ALT_PART_NUMBER2,
    im.display_online,
    im.active,
    IM.HITS,
    EH.EXTERNAL_HITS,
    BS.BEST_SELLER,
    MDN.MANUFACTURER_DISPLAY_NAME,
    ICVV.FIELD_VALUE COLLECTION_KEYWORD,
    nvl2(LP.PRODUCT_ID,DPI.DEFAULT_PRODUCT_ITEM,'Y') DEFAULT_PRODUCT_ITEM,
    m.manufacturer_name,
    b.brand_name,
    ICV.PRODUCT_CATEGORY_ID,
    LP.PRODUCT_ID PRODUCT_ID,
    ICV.PRODUCT_category,
    ICV.LEVEL1_CATEGORY,
    ICV.TAXONOMY_ID,
    NVL2(ICV.DEFAULT_CATEGORY,ICV.DEFAULT_CATEGORY,'Y') DEFAULT_CATEGORY,
    NVL(lim.short_desc,LIM.INVOICE_DESC) SHORT_DESC,
    ICV.display_priority,
    b.brand_image,
    ii.image_name ITEM_IMAGE,
    ii.image_type,
    NVL2(IM.UPDATED_DATETIME,IM.UPDATED_DATETIME,SYSDATE) LAST_UPDATED,
    NVL(P.PRODUCT_NAME,M.MANUFACTURER_NAME
    ||' '
    ||NVL(IM.MANUFACTURER_PART_NUMBER,IM.PART_NUMBER)) PRODUCT_NAME,
    NVL(P.PRODUCT_NUMBER,NVL(IM.MANUFACTURER_PART_NUMBER,IM.PART_NUMBER)) PRODUCT_NUMBER,
    LP.PRODUCT_PARTNUMBER_KEYWORDS PRODUCT_PARTNUMBER_KEYWORDS,
    P.PRODUCT_ITEM_COUNT,
    IM.SALES_UOM,
    LIM.LONG_DESC1,
    LIM.LONG_DESC2,
    P.PRODUCT_DESC,
    P.PRODUCT_IMAGE_NAME,
    P.PRODUCT_IMAGE_TYPE
  FROM ITEM_MASTER_PRICE_VIEW im,--item_master im,
    manufacturer m,
    BRANDS B,
    (SELECT *
    FROM CATEGORY_PATH_VIEW1 CP,
      ITEM_CATEGORY_VIEW IV
    WHERE CP.t3_TAXONOMY_TREE_ID=IV.PRODUCT_CATEGORY_ID
    ) ICV,
    loc_item_master lim,
    item_images ii,
    ITEM_CF_VALUES_VIEW ICVV,
    (SELECT ITEM_ID IFAV_ITEM_ID,
      (RTRIM (XMLAGG (xmlelement (ATTR_VAL, LAV.ATTRIBUTE_VALUE
      || ';')).extract ('//text()'))) FILTER_ATTRIBUTE_VALUES
    FROM ITEM_ATTRIBUTE_VALUES IAV,
      LOC_ATTRIBUTE_VALUES LAV,
      attributes a,
      (SELECT ATTR_NAME FROM DEFAULT_FILTER_ATTRIBUTE
      UNION ALL
      SELECT 'attr_Finish' FROM dual
      ) DFA
    WHERE IAV.LOC_ATTRIBUTE_VALUE_ID=LAV.LOC_ATTRIBUTE_VALUE_ID
    AND iav.attribute_id            =a.attribute_id
    AND UPPER(DFA.ATTR_NAME) LIKE UPPER('attr_%')
    AND UPPER(a.ATTRIBUTE_NAME)=UPPER(REPLACE(DFA.ATTR_NAME,'attr_',''))
    GROUP BY ITEM_ID
    ) IFAV,
    --PRODUCTS P,
    (
    SELECT LP.PRODUCT_DESC1
      ||' '
      || LP.PRODUCT_DESC2 AS PRODUCT_DESC,
      PI.IMAGE_NAME       AS PRODUCT_IMAGE_NAME,
      PI.IMAGE_TYPE       AS PRODUCT_IMAGE_TYPE ,
      PRD.*,
      IM2.PRODUCT_ITEM_COUNT
    FROM PRODUCTS PRD,
      (SELECT IM.PRODUCT_ID,
        COUNT(1) PRODUCT_ITEM_COUNT
      FROM ITEM_MASTER IM
      WHERE IM.ACTIVE!='D'
      GROUP BY IM.PRODUCT_ID
      ) IM2,
      LOC_PRODUCTS LP,
      PRODUCT_IMAGES PI
    WHERE PRD.PRODUCT_ID        = IM2.PRODUCT_ID(+)
    AND LP.PRODUCT_ID(+)        = PRD.PRODUCT_ID
    AND PI.PRODUCT_IMAGES_ID (+)= LP.PRODUCT_IMAGES_ID
    AND NVL(PRD.STATUS,'Y')     = 'Y'
    ) P,
    LOC_PRODUCTS LP,
    EXTERNAL_HITS EH,
    BEST_SELLER BS,
    MANUFACTURER_DISPLAY_NAME MDN,
    DEFAULT_PRODUCT_ITEM_VIEW DPI
  WHERE m.manufacturer_id(+) = im.manufacturer_id
  AND b.brand_id(+)          = im.brand_id
  AND ICV.item_id(+)         = im.item_id
  AND im.item_id             = lim.item_id(+)
  AND lim.locale_id(+)       = 1
  AND ii.item_image_id(+)    = lim.item_image_id
  AND ICVV.field_name(+)     = 'Collections'
  AND IM.ITEM_ID             = ICVV.ITEM_ID(+)
  AND EH.ITEM_ID(+)          = IM.ITEM_ID
  AND BS.ITEM_ID(+)          = IM.ITEM_ID
  AND DPI.ITEM_ID(+)         = IM.ITEM_ID
  AND P.PRODUCT_ID(+)        =IM.PRODUCT_ID
  AND LP.PRODUCT_ID(+)       =P.PRODUCT_ID
  AND LP.LOCALE_ID(+)        =1
  AND IM.ITEM_ID             =IFAV.IFAV_ITEM_ID(+)
  AND IM.ITEM_ID             =MDN.ITEM_ID(+)
  ),
  t2 AS
  (SELECT LISTAGG(iavv.attribute_name
    ||'|~|'
    || iavv.attribute_value
    ||' '
    || iavv.attribute_uom, '}~}') WITHIN GROUP (
  ORDER BY filter_seq) ATTRIBUTE_VALUES ,
    iavv.item_id T2_ITEM_ID,
    ic.item_classificaton_id T2_ITEM_CLASSIFICATION_ID
  FROM iav_view iavv,
    category_attributes ca,
    item_classification ic
  WHERE iavv.attribute_id = ca.attribute_id
  AND ca.filter_enabled   ='Y'
  AND iavv.item_id        = ic.item_id(+)
  AND ic.taxonomy_tree_id = ca.taxonomy_tree_id
  AND iavv.locale_id      =1
  GROUP BY iavv.item_id,
    IC.ITEM_CLASSIFICATON_ID
  ),
  T4 AS
  (SELECT LISTAGG(ICVV.FIELD_NAME
    ||'|~|'
    || ICVV.FIELD_VALUE , '}~}') WITHIN GROUP (
  ORDER BY ICVV.DISPLAY_SEQUENCE) CUSTOM_FIELD_VALUES ,
    ICVV.ITEM_ID T4_ITEM_ID
  FROM ITEM_CF_VALUES_VIEW ICVV
  GROUP BY ICVV.ITEM_ID
  )
SELECT KEY,
  ITEM_CLASSIFICATON_ID,
  ITEM_ID,
  PARTNUMBER_KEYWORDS,
  KEYWORDS,
  PART_NUMBER,
  POPULARITY,
  MANUFACTURER_ID,
  BRAND_ID,
  MANUFACTURER_PART_NUMBER,
  UPC,
  NET_PRICE,
  DISPLAY_ONLINE,
  ACTIVE,
  MANUFACTURER_NAME,
  BRAND_NAME,
  PRODUCT_CATEGORY_ID,
  PRODUCT_ID,
  PRODUCT_CATEGORY,
  COLLECTION_KEYWORD,
  LEVEL1_CATEGORY,
  TAXONOMY_ID,
  DEFAULT_CATEGORY,
  SHORT_DESC,
  DISPLAY_PRIORITY,
  BRAND_IMAGE,
  ITEM_IMAGE,
  IMAGE_TYPE,
  LAST_UPDATED ,
  PRODUCT_NAME,
  PRODUCT_NUMBER,
  PAGE_TITLE,
  BEST_SELLER,
  PRODUCT_ITEM_KEYWORDS,
  PRODUCT_PARTNUMBER_KEYWORDS,
  ATTRIBUTE_VALUES,
  T2_ITEM_ID,
  T2_ITEM_CLASSIFICATION_ID,
  HITS,
  CATEGORY_CODE_PATH,
  CATEGORY_NAME_PATH,
  EXTERNAL_HITS,
  NVL(DEFAULT_PRODUCT_ITEM,'N') DEFAULT_PRODUCT_ITEM,
  PRODUCT_ITEM_COUNT,
  CUSTOM_FIELD_VALUES,
  SALES_UOM,
  LONG_DESC1,
  LONG_DESC2,
  MANUFACTURER_DISPLAY_NAME,
  ALT_PART_NUMBER1,
  ALT_PART_NUMBER2,
  PRODUCT_DESC,
  PRODUCT_IMAGE_NAME,
  PRODUCT_IMAGE_TYPE
FROM T1,
  T2,
  T4
WHERE T1.ITEM_ID            =T2.T2_ITEM_ID(+)
AND T1.ITEM_CLASSIFICATON_ID=T2.T2_ITEM_CLASSIFICATION_ID(+)
AND T1.ITEM_ID              = T4.T4_ITEM_ID(+);
  

  
-----------------------------------------------------------------------------------------------------------------------------------------------------------

  

