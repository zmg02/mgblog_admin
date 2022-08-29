<template>
  <div class="my-tiny">
    <tiny-editor id="textarea" :init="myinit" :value="value" @input="$emit('input', $event)" />
  </div>
</template>

<script>
import Editor from "@tinymce/tinymce-vue";
export default {
  name: "Tinymce",
  props:["value"],
  data() {
    return {
      myinit: {
        selector: "textarea#full-featured",
        plugins: `code preview importcss searchreplace autolink autosave save 
                  directionality visualblocks visualchars fullscreen image link 
                  media template codesample table charmap pagebreak nonbreaking
                  anchor insertdatetime advlist lists wordcount help charmap 
                  quickbars emoticons `,
        mobile: {
          plugins:
            `code preview importcss searchreplace autolink autosave save
             directionality visualblocks visualchars fullscreen image link
             media template codesample table charmap pagebreak nonbreaking
             anchor insertdatetime advlist lists wordcount help charmap 
             quickbars emoticons 
             export advtable linkchecker mentions tinycomments permanentpen pageembed formatpainter editimage
             a11ychecker tinymcespellchecker tinydrive checklist mediaembed advcode tableofcontents casechange powerpaste`,
        },
        menu: {
          tc: {
            title: "Comments",
            items: "addcomment showcomments deleteallconversations",
          },
        },
        menubar: "file edit view insert format tools table tc help",
        toolbar:
          "undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen formatpainter removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments addcomment",
        toolbar_sticky: true,
        height: 600,
        language_url: "/tinymce/zh_CN.js",
        language: "zh_CN",
      },
    };
  },
  components: {
    "tiny-editor": Editor,
  },
};
</script>