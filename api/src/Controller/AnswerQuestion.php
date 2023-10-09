<?php

namespace App\Controller;

use App\Dto\QuestionInputDto;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Attribute\AsController;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

#[AsController]
class AnswerQuestion extends AbstractController
{
    public function __invoke(QuestionInputDto $data)
    {
        $payload = [
            'action' => 'predict',
            'fn_index' => 0,
            'data' => [
                $data->image,
                'Visual Question Answering',
                $data->question,
                'Nucleus sampling'
            ],
            'session_hash' => 'v79ugjo0z'
        ];

        $push_output = $this->post_request('https://salesforce-blip.hf.space/api/queue/push/', $payload);

        $waiting = true;
        while ($waiting) {
            $server_output = $this->post_request('https://salesforce-blip.hf.space/api/queue/status/', [
                'hash' => $push_output->hash
            ]);
            if ($server_output->status == 'COMPLETE') {
                $waiting = false;
            }
        }

        return new JsonResponse($server_output);
    }


    public function post_request($url, $data)
    {
        $headersArray = [
            'Host: salesforce-blip.hf.space',
            'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:109.0) Gecko/20100101 Firefox/110.0',
            'Accept: */*',
            'Accept-Language: en-GB,en;q=0.5',
            'Accept-Encoding: gzip, deflate, br',
            'Referer: https://salesforce-blip.hf.space/?__theme=light',
            'Content-Type: application/json',
            'Origin: https://salesforce-blip.hf.space',
            'Connection: keep-alive',
            'Cookie: session-space-cookie=8595ffba94f568ee355f8b0437bd1de2',
            'Sec-Fetch-Dest: empty',
            'Sec-Fetch-Mode: cors',
            'Sec-Fetch-Site: same-origin',
        ];
        $ch = curl_init();

        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_POST, 1);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headersArray);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

        $server_output = curl_exec($ch);

        curl_close($ch);

        return json_decode($server_output);
    }
}
