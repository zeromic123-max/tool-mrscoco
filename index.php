<?php
// 대표 주소(/)에서 정적 index.html을 그대로 제공
header('Content-Type: text/html; charset=utf-8');
readfile(__DIR__ . '/index.html');
