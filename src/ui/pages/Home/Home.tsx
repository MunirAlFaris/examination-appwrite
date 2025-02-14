import * as React from 'react';
import { Link } from 'react-router-dom';
import Markdown from '../../components/Markdown';


export default function Home() {
  const handleNavigateLink = (link: string) => {
    window.open(link, '_system');
    return false;
  }
  return (
    <div style={{maxWidth: '700px', margin: '0 auto 40px'}}>
      <div className='landing-section'>
        <h1>المدرسة الرقمية</h1>
        <div>
          نتيح لك في هذه المنصة كل ما تحتاجه في معهدك،
          <br />
            محادثات ومنشورات للمدرسة الرقمية مع مذاكرات تدريبية وامتحانات دورية
        </div>
      </div>
      <div className='mt-3'>
        <h2>الإمتحانات والمذاكرات</h2>
        <div className='cols-wrapper'>
          <div>
            <h4>المذاكرات</h4>
            <p>المذاكرات هي اختبارات تدريبية يمكنك إجراء المذاكرة متى اردت وستحصل على النتيجة فور الضفط على زر الإرسال بعد الانتهاء من الحل وليس هناك حدود لعدد مرات تقديم المذاكرة</p>
            <Link className='btn btn-primary' to='/tests'>صفحة المذاكرات</Link>
          </div>
          <div>
            <h4>الإمتحانات</h4>
            <p>الإمتحانات تحاكي نظام الإمتحانات بشكل قريب جدا فهناك وقت لبداية الإمتحان ووقت لنهاية الإمتحان ووقت للسماح برؤية سلم الحل ولا يمكنك تقديم نفس الإمتحان مرتين</p>
            <Link className='btn btn-primary' to='/exams'>صفحة الإمتحانات</Link>
          </div>
        </div>
      </div>
      <div className='mt-3'>
        <h2>المحادثات</h2>
        <p>نظام المحادثات يعتمد على المجموعات وهناك المجموعات الخاصة والعامة والخاصة بصف معين</p>
        <p><b>المجموعة العامة:</b> يمكن لكل الطلبة بمختلف الصفوف بما في ذلك الأساتذة من الدخول الى المحادثة والمشاركة فيها </p>
        <p><b>المجموعة الخاصة:</b> يحدد المدير أعضاء المحادثة ولا يمكن ان يشارك فيها سوى الأعضاء الذين تمت إضافتهم مسبقا</p>
        <p><b>المجموعة الخاصة بصف معين:</b> يشارك في هذه المجموعة الطلاب الذين هم بنفس الصف المحدد والأساتذة اللذين تمت إضافتهم</p>
        <Link className='btn btn-primary' to='/chats'>المحادثات</Link>
      </div>
      <div className='mt-3'>
        <h2>المنشورات</h2>
        <p>صفحة المنشورات عامة لكل المستخدمين بما في ذلك الضيوف يمكنهم رؤية المنشورات</p>
        <p>يتم نشر المنشورات من قبل الأساتذة والمدراء فقط ولا يمكن تعديلها إلا من قبل المالك أو المدير</p>
        <Link className='btn btn-primary' to='/posts'>المنشورات</Link>
      </div>
      <div className='mt-3'>
        <h2>محرر النصوص</h2>
        <p>تدعم المنصة محرر نصوص يتيح للمستخدم بإدراج جداول وكتابة معادلات رياضية والكثير من أدوات تحرير النصوص</p>
        <p>الأداة المستخدمة هي (Markdown) إضافة إلى (Katex) وهي لكتابة المعادلات الرياضية ومحرر النصوص هذا متوفر بكل أجزاء الموقع</p>
        <Markdown text='> **ملاحظة**: يجب أن تبدأ المعادلة الرياضية وتنتهي بعلامة ( $ ) حتى تظهر المعادلة بشكل صحيح'/>
        <p className='mt-2'>مراجع محرر النصوص:</p>
        <div className='d-flex flex-center flex-wrap gap-2'>
          <a className='btn btn-primary' href='#' onClick={() => handleNavigateLink('https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet')}>محرر النصوص (Markdown)</a>
          <a className='btn btn-primary' href='#' onClick={() => handleNavigateLink('https://utensil-site.github.io/available-in-katex/')}>المعادلات الرياضية (Katex)</a>
        </div>
      </div>
    </div>
  )
}