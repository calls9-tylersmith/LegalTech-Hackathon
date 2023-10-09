<?php

namespace App\Entity;


use ApiPlatform\Metadata\Get;
use App\Dto\QuestionInputDto;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use App\Controller\AnswerQuestion;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use Symfony\Component\Validator\Constraints as Assert;

/**
 * This is a dummy entity. Remove it!
 */
#[ApiResource(
    mercure: true,
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Post(
            name: 'answer_question',
            uriTemplate: '/answers/answer_question',
            controller: AnswerQuestion::class,
            input: QuestionInputDto::class,
        ),
    ]
)]
#[ORM\Entity]
class Answer
{
    /**
     * The entity ID
     */
    #[ORM\Id]
    #[ORM\Column(type: 'integer')]
    #[ORM\GeneratedValue]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    public $visibleFaults;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    public $safetyFaults;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    public $qualityFaults;

    #[ORM\Column(type: 'string', length: 255)]
    #[Assert\NotBlank]
    public $aiFaults;

    public function getId(): ?int
    {
        return $this->id;
    }
}
