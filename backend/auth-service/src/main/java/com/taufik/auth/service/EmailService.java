package com.taufik.auth.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${app.frontend.url:http://localhost:5173}")
    private String frontendUrl;

    @Value("${app.mail.from:SIASEK <noreply@siasek.com>}")
    private String mailFrom;

    @Async
    public void sendApprovalEmail(String to, String username, String role) {
        String subject = "Pendaftaran Disetujui - SIASEK";
        String roleLabel = "GURU".equals(role) ? "Guru" : "Siswa";
        String htmlContent = buildApprovalHtml(username, roleLabel);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Approval email sent to: {} for user: {}", to, username);
        } catch (MessagingException e) {
            log.error("Failed to send approval email to: {} - Error: {}", to, e.getMessage());
            throw new RuntimeException("Gagal mengirim email notifikasi: " + e.getMessage());
        }
    }

    @Async
    public void sendActivationEmail(String to, String fullName, String username, String activationToken) {
        String activationLink = frontendUrl + "/activate?token=" + activationToken + "&user=" + username;
        String subject = "Aktivasi Akun SIASEK - Sistem Informasi Akademik Sekolah";
        String htmlContent = buildActivationHtml(fullName, username, activationLink);

        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(mailFrom);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Activation email sent to: {} for user: {}", to, username);
        } catch (MessagingException e) {
            log.error("Failed to send activation email to: {} - Error: {}", to, e.getMessage());
            throw new RuntimeException("Gagal mengirim email aktivasi: " + e.getMessage());
        }
    }

    private String buildApprovalHtml(String username, String roleLabel) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
              <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1);">
                <div style="background:linear-gradient(135deg,#16a34a,#15803d);padding:32px;text-align:center;">
                  <div style="width:60px;height:60px;background:rgba(255,255,255,.2);border-radius:16px;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px;">
                    <span style="font-size:28px;">✅</span>
                  </div>
                  <h1 style="color:#fff;margin:0;font-size:24px;">SIASEK</h1>
                  <p style="color:rgba(255,255,255,.8);margin:4px 0 0;font-size:13px;">Sistem Informasi Akademik Sekolah</p>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#166534;font-size:20px;margin-top:0;">🎉 Pendaftaran Disetujui!</h2>
                  <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                    Halo <strong>%s %s</strong>,
                  </p>
                  <p style="color:#4b5563;font-size:15px;line-height:1.6;">
                    Pendaftaran akun SIASEK Anda telah <strong>disetujui</strong> oleh administrator.
                    Anda sekarang bisa login ke sistem.
                  </p>
                  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:20px 0;">
                    <p style="margin:0;color:#166534;font-size:14px;">
                      <strong>%s:</strong> %s
                    </p>
                  </div>
                  <div style="text-align:center;margin:28px 0;">
                    <a href="%s/login" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1e40af);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
                      🔐 Login Sekarang
                    </a>
                  </div>
                  <p style="color:#6b7280;font-size:13px;line-height:1.5;text-align:center;">
                    Gunakan <strong>%s</strong> sebagai username dan password yang Anda buat saat pendaftaran.
                  </p>
                </div>
                <div style="background:#f9fafb;padding:20px 32px;border-top:1px solid #e5e7eb;">
                  <p style="margin:0;color:#9ca3af;font-size:12px;text-align:center;">
                    &copy; 2026 SIASEK - Sistem Informasi Akademik Sekolah<br>
                    Email ini dikirim secara otomatis, mohon tidak membalas.
                  </p>
                </div>
              </div>
            </body>
            </html>
            """.formatted(roleLabel, username, roleLabel, username, frontendUrl, username);
    }

    private String buildActivationHtml(String fullName, String username, String activationLink) {
        return """
            <!DOCTYPE html>
            <html>
            <head><meta charset="UTF-8"></head>
            <body style="margin:0;padding:0;background:#f3f4f6;font-family:'Segoe UI',Tahoma,sans-serif;">
              <div style="max-width:600px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 4px 6px rgba(0,0,0,.1);">
                <div style="background:linear-gradient(135deg,#2563eb,#1e40af);padding:32px;text-align:center;">
                  <h1 style="color:#fff;margin:0;font-size:24px;">SIASEK</h1>
                  <p style="color:rgba(255,255,255,.8);margin:4px 0 0;font-size:13px;">Aktivasi Akun</p>
                </div>
                <div style="padding:32px;">
                  <h2 style="color:#1f2937;font-size:20px;margin-top:0;">Aktivasi Akun Anda</h2>
                  <p style="color:#4b5563;font-size:15px;line-height:1.6;">Halo <strong>%s</strong>,</p>
                  <p style="color:#4b5563;font-size:15px;line-height:1.6;">Klik tombol di bawah untuk mengaktifkan akun:</p>
                  <div style="text-align:center;margin:28px 0;">
                    <a href="%s" style="display:inline-block;background:linear-gradient(135deg,#2563eb,#1e40af);color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:600;">
                      🔓 Aktivasi Akun
                    </a>
                  </div>
                </div>
              </div>
            </body>
            </html>
            """.formatted(fullName, activationLink);
    }
}
